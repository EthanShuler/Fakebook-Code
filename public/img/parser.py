import csv

csv_file = open('news.csv', encoding="utf8")
csv_reader = csv.reader(csv_file, delimiter = ',')
lineCount = 1

f = open("fakeNewsLinks.txt", "w")


for row in csv_reader:
    if (lineCount == 1):
        lineCount += 1
    else:
        f.write(row[4])
        f.write("\n")
        lineCount += 1
        if (lineCount == 1000):
            break
