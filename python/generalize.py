import csv
import json
import tkinter as tk
from tkinter import filedialog as fd

level_info = {}
top_key = "Disease"
max_level = 4
privacy_column = 0
disease_column = 8
salary_column = 9
r = tk.Tk()
disease_generalization = {}
levels = {
    'lev1': 4000,
    'lev2': 8000,
    'lev3': 16000,
    'lev4': 32000,
}


def pre_process(root_key, level: int, values: list[str | dict]) -> list[str]:
    global disease_generalization
    to_return = []
    for value in values:
        if isinstance(value, str):
            to_return.append(value)
        else:
            for key, val in value.items():
                res = pre_process(key, level - 1, val)
                to_return += res
    for value in to_return:
        pre_processed_value = disease_generalization.get(value, {})
        pre_processed_value[f"lev{level}"] = root_key
        disease_generalization[value] = pre_processed_value
    return to_return


def on_select_label_file():
    global level_info
    filename = fd.askopenfilename()
    with open(filename, "r") as f:
        level_info = json.loads(f.read())
        print(level_info)
    pre_process(top_key, max_level, level_info[top_key])


def on_select_data_file():
    global privacy_column, disease_column, salary_column
    privacy_column = int(input_privacy_column.get())
    disease_column = int(input_disease_column.get())
    salary_column = int(input_salary_column.get())

    output = []
    filename = fd.askopenfilename()
    with open(filename, "r") as f:
        reader = csv.reader(f)
        for index, row in enumerate(reader):
            if row[privacy_column] == "none":
                output.append(row)
                continue
            # Process disease
            row[disease_column] = disease_generalization[row[disease_column]][row[privacy_column]]
            # Process salary
            price_range = levels[row[privacy_column]]
            try:
                salary = int(row[salary_column])  # to number
            except Exception as e:
                print(f"Invalid salary: {row[salary_column]} in row {index + 1}. Message: {e}")
            lower_range = (salary // price_range) * price_range
            upper_range = lower_range + price_range
            row[salary_column] = f'{lower_range // 1000}k - {upper_range // 1000}k'
            output.append(row)

    with open(f"{filename}.classified.csv", "w+", newline='') as f:
        writer = csv.writer(f)
        writer.writerows(output)
    r.destroy()


r.title("Classify data")
r.geometry("400x400")

btn_select_level = tk.Button(r, text="Select level file", command=on_select_label_file)
btn_select_data = tk.Button(r, text="Select data file", command=on_select_data_file)
input_privacy_label = tk.Label(r, text="Privacy Column")
input_privacy_column = tk.Entry(r)
input_privacy_column.insert(0, f"{privacy_column}")
input_disease_label = tk.Label(r, text="Disease Column")
input_disease_column = tk.Entry(r)
input_disease_column.insert(0, f"{disease_column}")
input_salary_label = tk.Label(r, text="Salary Column")
input_salary_column = tk.Entry(r)
input_salary_column.insert(0, f"{salary_column}")

input_privacy_label.pack()
input_privacy_column.pack()
input_disease_label.pack()
input_disease_column.pack()
input_salary_label.pack()
input_salary_column.pack()

btn_select_level.pack()
btn_select_data.pack()
r.mainloop()