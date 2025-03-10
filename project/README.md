# Maze Solver/Generator

This Project focuses on generating mazes, solving them using depth-first and breadth-first algoirthms, and providing an editing interface for maze modification.

## Table of Contents

- [Introduction](#introduction)
- [Video Demo](#video_demo)
  - [Description](#description)
- [Maze Solving Methods](#maze-solving-methods)
  - [Depth-First Algorithm](#depth_first_algorithm)
  - [Breadth-First Algorithm](#breadth_first_algorithm)
- [Maze Editing](#maze-editing)
- [Maze Generation](#maze-generation)
  - [Generating a Maze](#generating_a_maze)
  - [Creating an Empty Maze](#creating_an_empty_maze)
- [Timer](#timer)
- [Contributing](#contributing)


## Introduction

The Maze Solver Project aims to provide tools for maze generation, solving, and editing. Whether you want to explore different maze generation techniques, solve mazes using various algorithms, or modify exisiting mazes, this project has you covered.

#### Video Demo:

[MAZE GENERATOR & SOLVER](https://www.youtube.com/watch?v=GHeweCkFbbU)

##### Description

This is a simple video demo for the actual usage of the project with all the main features.

## Maze Solving Methods

Two primary methods for solving mazes are available in this project:

### Depth-First Algorithm

The depth-first algorithm is a maze-solving technique that involves exploring as far as possible along one branch before backtracking.

### Bredth-First Algorithm

The breadth-first algorithm employs a level-order traversal to explore all possible paths in the maze, layer by layer. This method ensures that the shortest path is found first. The project utilizes the breadth-first algorithm to solve mazes efficiently.

## Maze Editing

The editing section of the project allows users to interactively modify existing mazes or creating a new one from the start. You can add or remove walls, change the layout of passages, and experiment with different maze configurations.

## Maze Generation

The project provides three maze generation methods, each with it's unique characteristics:

### Generating a Maze

Users can generate a maze using three distinct methods: Prim's alogirthm, Kruskal's algorithm, and recursive division. You can specify the size of the grid and choose a generation method.

### Creating an Empty Maze

In addition to generating mazes with paths and walls, the project also supports creating an empty maze. This feature is usefull if you want to build a maze from scratch.

# Timer

Also the project has a feature that allows us to figures out what is the fastest method to solve any maze, with a pop-up that tells the time took for the maze to be resolved.

# Contributing

The maze solver could be improved by adding another type of searching method. Also some new generation method and a little bit of styling on the maze solver and the HUD.