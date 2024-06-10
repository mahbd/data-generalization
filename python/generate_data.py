import csv
import json
import sys
from random import randint, choice, choices
from string import ascii_uppercase


def pre_process(values: list[str | dict]) -> list[str]:
    to_return = []
    for value in values:
        if isinstance(value, str):
            to_return.append(value)
        else:
            for key, val in value.items():
                res = pre_process(val)
                to_return += res
    return to_return


class Person:
    def __init__(self):
        self.age_range = (20, 90)
        with open("example_disease_classification.json", "r") as f:
            level_info = json.loads(f.read())
            self.disease_list = pre_process(level_info["Disease"])

    def get_age(self):
        random_age = (randint(self.age_range[0], self.age_range[1]) // 10) * 10
        return f'{random_age} < Age <= {random_age + 10}'

    def get_disease(self):
        return choice(self.disease_list)

    def get_random(self):
        privacy = choice(["level1", "level2", "level3", "level0", "level1", "level2", "level3", "level4"])
        name = '*'
        age = self.get_age()
        gender = f'{choice(["Male", "Female"])}'
        height = f'{randint(150, 200)}cm'
        weight = f'{randint(50, 100)}kg'
        state_of_domicile = ''.join(choices(ascii_uppercase, k=2))
        religion = '*'
        disease = self.get_disease()
        salary = randint(60, 100_0) * 100
        return privacy, name, age, gender, height, weight, state_of_domicile, religion, disease, salary


if __name__ == '__main__':
    count = sys.argv[1] if len(sys.argv) > 1 else 1
    filename = sys.argv[2] if len(sys.argv) > 2 else 'data.csv'
    data = []
    for _ in range(int(count)):
        data.append(Person().get_random())
    with open(filename, 'w+', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(
            ['Privacy', 'Name', 'Age', 'Gender', 'Height', 'Weight', 'State of Domicile', 'Religion', 'Disease',
             'Salary'])
        writer.writerows(data)