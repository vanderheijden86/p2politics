import random
import pandas as pd

#In this file we generate the opinions to be used in the demo.

#In the demo we will show votes on the question:

#Do you want trash to be collected weekly or bi-weekly, where the first will
#cost 300 euros in trash tax and the later only costs 180 euros in trash tax
problem1 ={'arguments_favour': [['I do not like the smell of the trash when I have to keep it for two weeks.',
                                 'It will smell.'],
                                ['I have nowhere to store so much trash.',
                                 'Takes too much space.'],
                                ['I produce so much trash that it has to be collected weekly.'],
                                ['I like to keep my house clean.']],
           'arguments_against' : [['Weekly is too expensive.',
                                   'I prefer to safe money.',
                                   'This is cheaper.'],
                                  ['I do not need weekly collection.',
                                   'I do not have that much trash.'],
                                  ['Trash collection causes noise.',
                                   'Seeing the trash each week is ugly.',
                                   'Having a collection each week brings back the ugly trash and noise each week.',
                                   'The trash collection is always early and wakes me up.',
                                   'Collecting each week results in a higher fuel consumption.'],
                                  ['bi-weekly collection will motivate people to produce less trash.',
                                   'Otherwise a lot of trash will be produced.']]}

def generate_opinion(problem, favour=True, opiniative=0.5):
    reaction=[]
    if favour:
        stance='arguments_favour'
    else:
        stance='arguments_against'
    opinions=problem[stance]
    for opinion in opinions:
        if random.random() < opiniative:
            reaction.append(random.choice(opinion))
    random.shuffle(reaction)
    return ' '.join(reaction)


def generate_opinions(number_of_voters=100, chance_in_favour=0.5, problem=problem1):
    votes=[]
    reactions=[]
    for voter in range(0,number_of_voters):
        if random.random() < chance_in_favour:
            vote = True
        else:
            vote = False
        reactions.append(generate_opinion(problem, favour=vote, opiniative=random.random()))
        votes.append(vote)
    return votes, reactions

def main():
    votes, reactions = generate_opinions(number_of_voters=1261, chance_in_favour=0.35, problem=problem1)
    data = pd.DataFrame({'votes': votes, 'opinions' : reactions})
    data.to_csv('../data/generatedvotes/trash.csv')

main()