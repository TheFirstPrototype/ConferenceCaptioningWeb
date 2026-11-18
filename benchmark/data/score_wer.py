#!/usr/bin/env python3
"""Word error rate scorer used for the ConferenceCaptioning live-captioning benchmark (https://conferencecaptioning.com/benchmark/).

Usage:
    python3 score_wer.py reference.txt hypothesis.txt

Prints word accuracy and word error rate, with and without filler sounds, plus the wrong / missed / extra counts.
No third-party packages needed. The rules are the ones described on the benchmark page:

  * lowercase; punctuation and accents dropped; numbers spelled out ("25,000" -> twenty five thousand)
  * a word in {braces} such as {Dr|Doctor} or {then|~} lists accepted spellings; "~" means the word may also be skipped
  * a bare * in the reference is a wildcard for one word nobody can make out: it matches any one word, or none
  * filler sounds (uh, um, mhm, ...) are ignored in the main score and counted in the "every word" score
  * score = (wrong + missed + extra) / words in the reference, from a word-level edit-distance alignment

MIT License. Copyright (c) 2026 ConferenceCaptioning.
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions: the above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""
import re
import sys
import unicodedata

FILLERS = {"uh", "um", "uhm", "umm", "er", "erm", "ah", "mm", "mmm", "mhm", "hmm", "hm"}
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def spell(n):
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else "-" + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + spell(n % 100))
    if n < 1_000_000:
        return spell(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + spell(n % 1000))
    return str(n)


def tokens(text, drop_fillers=False):
    t = text.lower().replace("’", "'").replace("‘", "'")
    t = "".join(c for c in unicodedata.normalize("NFKD", t) if not unicodedata.combining(c))
    t = re.sub(r"(?<=\d),(?=\d)", "", t)
    t = re.sub(r"\d+", lambda m: " " + spell(int(m.group())) + " ", t)
    t = re.sub(r"\{([^{}\s]+)\}", r" \1 ", t)
    t = re.sub(r"[^a-z0-9'|~* ]", " ", t.replace("\n", " "))
    words = [w.strip("'") for w in t.split()]
    words = [w for w in words if w]
    return [w for w in words if w not in FILLERS] if drop_fillers else words


def matches(ref, hyp):
    return ref == "*" or ref == hyp or ("|" in ref and hyp in ref.split("|"))


def optional(ref):
    return ref == "*" or ("|" in ref and "~" in ref.split("|"))


def align(ref, hyp):
    n, m = len(ref), len(hyp)
    d = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        d[i][0] = d[i - 1][0] + (0 if optional(ref[i - 1]) else 1)
    for j in range(m + 1):
        d[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if matches(ref[i - 1], hyp[j - 1]) else 1
            d[i][j] = min(d[i - 1][j - 1] + cost, d[i - 1][j] + (0 if optional(ref[i - 1]) else 1), d[i][j - 1] + 1)
    sub = dele = ins = 0
    i, j = n, m
    while i > 0 or j > 0:
        if i > 0 and j > 0:
            cost = 0 if matches(ref[i - 1], hyp[j - 1]) else 1
            if d[i][j] == d[i - 1][j - 1] + cost:
                sub += cost
                i -= 1
                j -= 1
                continue
        if i > 0 and d[i][j] == d[i - 1][j] + (0 if optional(ref[i - 1]) else 1):
            dele += 0 if optional(ref[i - 1]) else 1
            i -= 1
        else:
            ins += 1
            j -= 1
    return sub, dele, ins


def score(reference, hypothesis, drop_fillers):
    ref, hyp = tokens(reference, drop_fillers), tokens(hypothesis, drop_fillers)
    sub, dele, ins = align(ref, hyp)
    errors = sub + dele + ins
    return {"words": len(ref), "wrong": sub, "missed": dele, "extra": ins, "errors": errors, "wer": errors / max(1, len(ref))}


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    reference, hypothesis = (open(p, encoding="utf-8").read() for p in sys.argv[1:3])
    for label, drop in (("fillers ignored (headline score)", True), ("every word counted", False)):
        r = score(reference, hypothesis, drop)
        print(f"{label}: word accuracy {100 * (1 - r['wer']):.1f}%  word error rate {100 * r['wer']:.1f}%  "
              f"({r['errors']} errors in {r['words']} words: {r['wrong']} wrong, {r['missed']} missed, {r['extra']} extra)")


if __name__ == "__main__":
    main()
