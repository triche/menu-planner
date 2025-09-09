# Menu Planner Theory of Operation

The Menu Planner is a tool designed to help generate a meal plan for lunch
and dinner for a week based on a target macronutrient distribution. It uses
GPT-5 to create a varied menu that meets the specificed nutritional goals.

## Primary Architecture and UX

The Menu Planner is a web application built on React. It's code is well
modularized and documented to facilitate understanding and maintenance.

The user interface is designed to be intuitive and user-friendly. There is
a window for users to input their target macronutrient distribution, as
well as any style preferences or ommissions they want in the menu. There is
also a window for pasting in the previous week's menu such that the new
menu can avoid repeated meals.

There is a generate button that takes the user's inputs for desires style
and nutrition, and the previous week's menu, and then sends that to GPT-5
to generate a new menu. The generated menu is displayed in a table format
with breakfast, lunch, and dinner for each day of the week.

The user can also specify which meals they want and what days to make a
menu for. There should be a UX element, outside of the main input window,
to specify these options.

The UX should be modern with modern style, modern fonts, and a modern color
palette. It should be in dark mode by default, with a light mode option.
The UX should be responsive and work well on both desktop and mobile
devices.

Recommend a way to securely store the API key necessary to access GPT-5.

Please construct system prompts as separate files in the repository. Please
make it clear what these prompts are used for with documentation and file
names.
