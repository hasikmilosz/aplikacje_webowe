from html.parser import charref
from pathlib import Path

if __name__ == '__main__':
    dane = Path("sygnaly.txt")
    wynik = Path("wyniki4.txt")

    wynik.write_text("zadanie 4_1:\n")

    with open(dane, "r", encoding="utf-8") as f:
        linie = f.readlines()

    with open(wynik, "a", encoding="utf-8") as out:
        for i, line in enumerate(linie):
            if (i + 1) % 40 == 0:
                out.write(line[9])
        out.write("\n")

        out.write("zadanie 4_2:\n")

        maxCounter = 0
        maxString = ""

        for line in linie:
            line = line.strip()
            lineSorted = sorted(line)

            counter = 1

            for i in range(len(lineSorted) - 1):
                if lineSorted[i] != lineSorted[i + 1]:
                    counter += 1

            if counter > maxCounter:
                maxCounter = counter
                maxString = line

        out.write(maxString + " " + str(maxCounter) + "\n")
        out.write("zadanie 4_3:\n")
        for line in linie:
            line = line.strip()
            lineSorted = sorted(line)

            if ord(lineSorted[-1]) - ord(lineSorted[0])<=10:
                out.write(line+ "\n")
