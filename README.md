# UniversalDataPipes

## Description

Universal Data Pipes (UDP) is a flexible and extensible framework designed for
data manipulation and transformation, all locally on the browser. It allows
users to construct and manage data pipelines with an intuitive graphical
interface, enabling seamless integration of various data sources and formats.
With a modular architecture, users can easily add custom nodes and
functionalities to suit their specific data processing needs.

## Table of contents

- [Run the app locally](#run-the-app-locally)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [Lincense](#license)
- [Acknowledgements](#acknowledgements)

## Run the app locally

To get started with UDP, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/WNJStudio/UniversalDataPipes.git
```

2. Change directory into the project folder:

```bash
cd UniversalDataPipes
```

3. Install dependencies:

```bash
deno install --allow-scripts
```

4. Run the dev server:

```bash
deno run dev
```

## Usage

1. **Accessing the app**: Open your web browser and navigate to
   `http://localhost:5173`.
2. **Creating a Data Pipeline**: Use the graphical interface to drag and drop
   nodes to build your pipeline.
3. **Connecting nodes**: Click and drag the handles from one node to another to
   connect them, establishing data flow.
4. **Data flow**: As soon as the nodes are connected and there is input data,
   you will see the effects on each node.
5. **Output nodes**: Using the various output nodes you can retrieve the results
   of the processing in various formats and ways

## Features

- **Intuitive Interface**: A user-friendly graphical interface for building data
  pipelines.
- **Modular Architecture**: Easily add custom nodes and functionalities to meed
  specific data processing needs.
- **Real-time Data Processing**: Pipelines run automatically as nodes are
  connected, providing immediate feedback.
- **Support for all the data formats**: Your data, your format.
- **Visual Data Flow**: Clearly visualize data flow between nodes for better
  understanding and debugging.

## Contributing

Contributions are welcome! To contribute to UDP, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b my-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin my-feature
   ```
5. Open a pull request detailing your changes.

Please ensure your code adheres to the project's coding standards and passes all
tests before submitting.

## License

This project is licensed under the GPL-3.0 License. For more details see the
LICENSE file.

## Acknowledgements

- [Deno](https://deno.land/) for providing a secure runtime for JavaScript and
  TypeScript.
- [Svelte](https://svelte.dev/) for enabling a reactive programming model to
  build user interfaces.
- [Tailwind](https://tailwindcss.com/) for styling and themeing the project.
- [Lucide](https://lucide.dev/) for the icons used in the project.
- **WNJStudio**, the creator of the project
- And many others to come, for their valuable contributions to the project.
