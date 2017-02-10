# Rules

Een rule is een class die een function bijhoudt (de conditie logica) die uitgevoerd kan worden.
```typescript
let rule = new Rule(function);
```

Deze Rule kan wanneer nodig gevalideerd worden (het uitvoeren van de function) met de nodige argumenten.
```typescript
rule.validate(...);
```
Hier kan ... een x aantal nummer aan argumenten zijn.

Deze worden dan meegegeven aan de function met de conditie logica om de rule te valideren.

---
Voorbeeld
```typescript
function logic(arg1, arg2, arg3) {
    return <boolean>result;
}

let rule = new Rule(logic);

let isValid = rule.validate(1, 'test', true);
```

Deze code zorgt ervoor dat de logic function op de volgende manier wordt aangeroepen.
```typescript
function logic(1, 'test', true) {
    return <boolean>result;
}
```

Een werkend voorbeeld zou zijn:
```typescript
let rule = new Rule((authenticationService) => {
    return authenticationService.hasToken && !authenticationService.isTokenExpired;
});

let as = new AuthenticationService();
let isLoggedIn = rule.validate(as);
```

# Property rules

Een property rule is een uitbreiding op de Rule, die te gebruiken is om een set van properties te controleren.

* Als eerste argument geef je er een array van de te controleren properties aan mee.
* Als tweede optionele argument kun je de matchtype mee geven (All of Any).
* Als derde optionele argument kun je het sub-matchtype mee geven, indien er objecten aan de rule worden meegegeven.

Een werkend voorbeeld met zowel een matchtype als een submatchtype zou zijn:
```typescript
new PropertyRule([UserRole.Rabobank, {
    state: [PremievoorstelState.Customer],
    actionType: [ActionType.Processing, ActionType.Reserve, ActionType.ReadyForCustomer]
}], MatchType.All, MatchType.Any)
```
De property rule krijgt 2 properties mee. Het tweede is een object. Door het zetten van de submatchtype geven we in dit geval aan dat één van de 2 object properties maar waar hoeft te zijn. (vandaar de 2e MatchType.Any)

# Rules combineren met RuleSets

## Wat is een RuleSet
Een RuleSet is zoals het heet een Set aan Rules.
Het voordeel van een RuleSet is dat deze Rules gezamenlijk uitgevoerd kunnen worden.
Dit geeft als resultaat een State met welke rules geslaagd zijn.

## Werking

```typescript
let ruleSet = new RuleSet({
    'rule1': new Rule(logic1),
    'rule2': new Rule(logic2)
});

let state = ruleSet.validate(...); // Valideer alle rules in de set

console.log(state); // { 'rule1': boolean, 'rule2': boolean }
```
Zoals te zien hierboven maak je een RuleSet aan.
Hierin geef je een object mee met daarop key value pairs.
De key is hier de StateKey en de value is een Rule voor die state.

De Rules worden hier als volgt aangeroepen.
```typescript
// Stel validate wordt als volgt aangeroepen
ruleSet.validate(1, 'test', false);

// Dan worden de Rules als volgt gevalideerd (aangeroepen)
function logic1(1, 'test', false) {
    return boolean;
}

function logic2(1, 'test', false) {
    return boolean;
}
```

De rules worden beide met dezelfde argumenten aangeroepen. Als dit doormiddel van de RuleSet gebeurd.

# Rules groeperen met RuleGroups

## Wat is een RuleGroup
De RuleGroup class is meer een wrapper om de RuleSet heen en maakt het valideren van deze RuleSets eenvoudiger.
De RuleGroup is een soort opdeling van action sets.

```typescript
let ruleGroup = new RuleGroup({
    'set1': new RuleSet(...),
    'set2': new RuleSet(...)
});

ruleGroup.validateAll(set, ...); // Returns State
ruleGroup.validateSingle(set, rule, ...); // Returns boolean
```

De ... hierboven in de verschillende validatie functies werken hetzelfde als hoe de Rule zijn validatie argumenten werken.

# RuleUtils

## Combine
Combine maakt het mogelijk om verschillende Rules samen te voegen tot 1 Rule.
Bijvoorbeeld als er een regel nodig is voor het valideren van 2 verschillende stukken logica in 1 regel kan dat hiermee.

```typescript
let rule = RuleUtils.combine(PassType.Any | PassType.All, [ Rules ]);
// PassType.Any geeft aan dat de combined rule true geeft als 1 van de meegegeven rules true geeft bij validatie.
// PassType.All geeft aan dat de combined rule true geeft als alle rules van de meegegeven rules true geven bij validatie.
```

Hierbij kan Rules als volgt geïmplementeerd worden
```typescript
[
    new Rule(logic1), // logic1 = function(arg1) {  }
    new Rule(logic2)  // logic2 = function(arg6, arg10) {  }
]
```

De rule die terug komt van combine is hetzelfde als elke andere rule en kan als volgt gevalideerd worden.
```typescript
rule.validate(...); // Return boolean

// De argumenten voor elke onderliggende rule worden los aangegeven
let arg1 = 'test';
let arg6 = 123;
let arg10 = true;
rule.validate([arg1], [arg6, arg10]);
```

Een trucje om voor een combined rule hetzelfde argument mee te geven aan in de validate is om hier een extra rule omheen te zetten.
Dit ziet er als volgt uit.
```typescript
function logic1(arg1, arg2) { }
function logic2(arg1, arg2) { }

let combinedRule = return RuleUtils.combine(PassType.Any, [
    new Rule(logic1),
    new Rule(logic2)
]);

let rule = new Rule((arg1, arg2) => {
    return combinedRule.validate(arg1, arg2);
});
let result = rule.validate(1, 2); // Beide rules worden zo aangeroepen met arg1, arg2
```
