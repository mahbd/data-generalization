# Data Generalization

For any kind of research we need to collect lot of data. Sometimes, these data contains sensitive information. Although researcher tries to keep all these data as secure as possible but still there is a chance that it will fall in bad actors hand. They may misuse these data. That's why we are trying to anonymise data so that if a bad actor take control of these data they won't be able to use these for users harm.

# How it works

## Numeric data

For this type of data it replaces the original with a range. For example, if you set the range to 20 and your data value is 11, this value will be replaced with 0 - 20, if value is 25, it will be replaced with 20 - 40

## Categorical Data

This type of data can't be represented as range. So, we replace this type of data with its parent parent name. For example, Broken Hand or Broken Leg can be replaced with Broken Bone. From Broken Bone researchers can get the idea what happened but bad actors won't find this helpful.

# How to use it

1. Go to this [link](https://dg.mahmudul.com.bd/) or double click the executable file. The executable file can be found in latest releases.
2. Click on choose file button and select the file to be generalized. The file has some specific requirement. Check below section for it.
3. Select which column contains privacy level information.
4. Select a column which should be generalized.
5. Select type of value in this column.
6. If value is numeric then set range for each privacy level
7. If value is categorical then create the hierarchy like the image. ![](/src/public/categorical_hierarchy.png)
8. They click categorize data.
9. If you're using desktop you will see a preview side by side. If you're using mobile please scroll down to see preview.
10. You will see a download button to download the modified data.

## Data file criteria

1. It must be a csv file.
2. Top row must be the heading.
3. There must be a colum for privacy level details. Privacy level should be given like: `level1` `level2` etc.
