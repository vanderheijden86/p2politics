import pandas as pd
from gensim import corpora, models
from collections import defaultdict
from pprint import pprint
import re

def testwithgenerateddata():
    data = pd.read_csv('../data/generatedvotes/trash.csv')
    votes_favour = data[data['votes']==True]
    votes_against = data[data['votes']==False]
    docfavour = votes_favour['opinions'].dropna().values
    docagainst = votes_against['opinions'].dropna().values
    topic_model(docfavour)
    topic_model(docagainst)

def bookdata():
    data = pd.read_csv('../data/amazon_book_reviews/Donna-Tartt-The-Goldfinch.csv', sep='\t', quoting=3, header=None)
    ultimate_regexp = "(?i)<\/?\w+((\s+\w+(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)\/?>"
    print(data[3].replace(to_replace=ultimate_regexp, value='', regex=True))

def topic_model(documents):
    stoplist = set('for a of the and to in is'.split())
    texts = [[word for word in document.lower().split() if word not in stoplist] for document in documents]

    frequency = defaultdict(int)
    for text in texts:
        for token in text:
            frequency[token] += 1

    texts = [[token for token in text if frequency[token] > 1] for text in texts]
    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]
    lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=5, update_every=1, chunksize=10000, passes=1)
    pprint(lda.print_topics(5))

bookdata()
