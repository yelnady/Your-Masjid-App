import csv

results = []
with open("azan.csv") as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:  # each row is a list
        row[0] = row[0]+' AM'
        row[1] = row[1]+' AM'
        row[2] = row[2]+' PM'
        row[3] = row[3]+' PM'
        row[4] = row[4]+' PM'
        row[5] = row[5]+' PM'
        print(row[:-1], end='')
        print(',')
