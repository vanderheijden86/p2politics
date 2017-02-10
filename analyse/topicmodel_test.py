import csv

def readdata():
    with open('../data/redditposts/redditeuolym.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            print(row[0])
readdata()