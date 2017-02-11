import pandas as pd
from gensim import corpora, models
from collections import defaultdict
from pprint import pprint
import re
from gensim.parsing.preprocessing import STOPWORDS
from gensim.utils import simple_preprocess

def testwithgenerateddata():
    #To test with the generated data
    data = pd.read_csv('../data/generatedvotes/trash.csv') #name of the file
    votes_favour = data[data['votes']==True] #votes for
    votes_against = data[data['votes']==False] #votes against
    docfavour = votes_favour['opinions'].dropna().values #written as an array
    docagainst = votes_against['opinions'].dropna().values #written as an array
    topic_model(docfavour) #run the topic model over the data (only for now, can change)
    return topic_model(docagainst)

def bookdata():
    #To test it with the bookreviewdata
    data = pd.read_csv('../data/amazon_book_reviews/Donna-Tartt-The-Goldfinch.csv', sep='\t', quoting=3, header=None)
    ultimate_regexp = "(?i)<\/?\w+((\s+\w+(\s*=\s*(?:\".*?\"|'.*?'|[^'\">\s]+))?)+\s*|\s*)\/?>" #filter html-tags
    return topic_model(data[3].replace(to_replace=ultimate_regexp, value='', regex=True).values) #filter html-tags

def topic_model(documents):
    #In this function a topic model (lda) is made from the data, we use 5 topics
    #First tokenize and remove stop words
    texts = [[token for token in simple_preprocess(document) if token not in STOPWORDS] for document in documents]
    #remove terms only occuring once.
    frequency = defaultdict(int)
    for text in texts:
        for token in text:
            frequency[token] += 1
    texts = [[token for token in text if frequency[token] > 1] for text in texts]

    #create dictionary and corpus from the texts
    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]

    #run and return the topic model.
    lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=5, update_every=1, chunksize=10000, passes=1)
    return lda, dictionary

def topic_unseen_document(dictionary, lda, document):
    #Determine in which topics the unseen document fits
    new_vec = dictionary.doc2bow([token for token in simple_preprocess(document) if token not in STOPWORDS])
    return lda[new_vec]

def main():
    #run some code
    lda, dictionary = use_votedata()
    pprint(lda.print_topics(-1))
    print(topic_unseen_document(dictionary, lda, 'I like shopping.'))

def use_votedata():
    #use the vote data we created.
    data=votedata(2)
    opinions =[]
    for vote in data:
        opinions.append(vote['comment'])
    return topic_model(opinions)

def votedata(proposal=1):
    if proposal==1:
        return [{'proposalId': '1', 'value': 'Yes', 'comment': 'Currently I can not go shopping after work because I do not have the time to travel to the center.'},
             {'proposalId': '1', 'value': 'No', 'comment': 'I do not really like shopping.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'I like to have shopping facilities nearby.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'This will attract more people.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'Yes I would like to be able to go shopping during lunch hours.'},
             {'proposalId': '1', 'value': 'No', 'comment': 'I do not think this is the best way to spend our budget, the new residential area was already very expensive.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'This will safe a lot of people a lot of time and make the new appartments more attractive.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'I like to have more and thus more diverse shops.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'Then maybe visitors to Groningen can also check out the wonderful Groningen-Oost.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'This will help in raising the value of our houses in the neighbourhood.'},
             {'proposalId': '1', 'value': 'No', 'comment': 'There is already a problem with getting all the shops in the city center filled because of the crisis.'},
             {'proposalId': '1', 'value': 'No', 'comment': 'No please not, the construction of the apartments already made so much noise, I can not stand yet another year of noisy construction. '},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'A great way to keep people busy and off the streets.'},
             {'proposalId': '1', 'value': 'Yes', 'comment': 'Yes I would like to go shopping there once.'}]

    if proposal==2:
        return [{'value': 'Yes', 'proposalId': '2', 'comment': 'Sounds like a good plan to use the empty PostNL building!'},
             {'value': 'No', 'proposalId': '2', 'comment': 'There is no bus stop nearby, so the new shopping center would never become really popular.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'I still think there is a better way of spending municipality money. We have enough shopping centers in Groningen.'},
             {'value': 'Yes', 'proposalId': '2', 'comment': 'It is a good way of using all that space in the old PostNL building.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'A more accessible place would be better suitable for a shopping center.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'There are more empty buildings in the neighbourhood. I think the empty KPN building for example is much more aestestic and therefor more suitable for a new shopping center.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'I think other places that are more accessible are better suited to place a new shopping center.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'Why not building a shopping center next to a bus stop? Public transport is often used in this area.'},
             {'value': 'No', 'proposalId': '2', 'comment': 'The old PostNL building is still close to the city center, so I do not know if this shopping center would really add something'},
             {'value': 'Yes', 'proposalId': '2', 'comment': 'The industrial feed of the old PostNL building suits the neighbourhood well.'}]

    if proposal==3:
        return [{'proposalId': '3', 'value': 'Yes', 'comment': 'Yes I was already a fan last time.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Yes, now everybody can come to shop here.'},
             {'proposalId': '3', 'value': 'No', 'comment': 'I still do not like the shopping centre.'},
             {'proposalId': '3', 'value': 'No', 'comment': 'No need, very expensive.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Yes I still like the idea.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Wonderful, now it is also easier to go to other places in the city with the new bus.'},
             {'proposalId': '3', 'value': 'No', 'comment': 'Also with the bus stop I am against the shopping centre because we have enough shops.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Good idea the bus stop.'},
             {'proposalId': '3', 'value': 'No', 'comment': 'Too expensive.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Yes, I like the shopping center nearby.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Very good idea.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Still in favour.'},
             {'proposalId': '3', 'value': 'No', 'comment': 'I am still very much against.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'Yes this will safe me a lot of time.'},
             {'proposalId': '3', 'value': 'Yes', 'comment': 'The bus will allow me to also make use of this shopping center and now I am in favour'}]

main()