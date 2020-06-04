# Generer Sandhedstabel

Generer sandhedstabel ud fra udtryk involverende logiske operatorer. Applikationen fungerer ved først
at bygge tokens af det indtastede udtryk hvorefter disse tokens bliver parset baseret på grammatikken for
udtryk. Parseren bygger sideløbende et parsetræ med en struktur der garanterer at en evaluering af træet
gjort med et post-order gennemløb giver den ønskede præcedens og associativitet af operatorer. Et post-order 
gennemløb og evaluering bliver derefter udført for hver række af den sandhedstabel der tilsvarer det indtastede 
udtryk, således at den sidste kolonne i tabellen indeholder sandhedsværdien for rækkerne. Hvis ikke udtrykket 
er veldefineret gives en fejlbesked. 

Applikationen kan findes live på [www.sandhedstabel.dk](https://sandhedstabel.dk/)