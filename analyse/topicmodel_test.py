import pandas as pd
from gensim import corpora, models
from collections import defaultdict
from pprint import pprint

def readdata():
    data = pd.read_csv('../data/generatedvotes/trash.csv')
    votes_favour = data[data['votes']==True]
    votes_against = data[data['votes']==False]
    return votes_favour, votes_against



def topic_model(documents):

    stoplist = set('for a of the and to in'.split())
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

votes_favour, votes_against = readdata()
docfavour = votes_favour['opinions'].dropna().values
docagainst = votes_against['opinions'].dropna().values
topic_model(docfavour)