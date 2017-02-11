import random
import pandas as pd

#In this file we generate the opinions to be used in the demo.

#some questions and answers to those to use for generating data.

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

problem2 = {
    'arguments_favour': [
        ['The public transport is sufficient.', 'Enough busses drive through the city center.', 'People can use public transport.'],
        ['It would make the city center more safe.', 'Safety is a very important issue.', 'A safer city center is better for everyone.'],
        ['It is better for the environment.', 'The gases are not good for the environment.', 'It would make the city center a more clean space.']
    ],
    'arguments_against': [
        ['Disabled people should not have to walk.', 'The public transport is not always suited to disabled people', 'Public transport is not for everyone.'],
        ['Some streets in the city center are very suitable for cars.', 'Not in every street cars are a problem.']
    ]
}

problem3 = {
    'arguments_favour': [
        ['It is not ethical to keep people in poverty.', 'Keeping people in poverty is not ethical.'],
        ['The Netherlands is a rich country so we should help people who have less.', 'We as a country are rich enough to help poor people.']
    ],
    'arguments_against': [
        ['People should earn their own money.', 'Those people could earn their own money.']
    ]
}

#Generates a single opinion
def generate_opinion(problem, favour=True, opiniative=0.5):
    reaction=[]
    if favour:
        stance='arguments_favour'
    else:
        stance='arguments_against'
    #only take the arguments from the correct stance
    opinions=problem[stance]
    for opinion in opinions:
        if random.random() < opiniative: #randomly, but opiniative decides how much chance to have an opinion
            reaction.append(random.choice(opinion))
    random.shuffle(reaction) #shuffle the reaction
    return ' '.join(reaction) #and return it as a sentence


def generate_opinions(number_of_voters=100, chance_in_favour=0.5, problem=problem1):
    #Generates a series of votes (so many as number_of_voters) by picking opinions from the collection of possible
    #opinions. The chance of picking opinions in favour or not can be set.
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
    #main
    votes, reactions = generate_opinions(number_of_voters=1261, chance_in_favour=0.35, problem=problem1)
    data = pd.DataFrame({'votes': votes, 'opinions' : reactions})
    data.to_csv('../data/generatedvotes/trash.csv') #save the data

main()
