# tracker
Tracker is a command line operated time tracking tool.

## Installation
1. Clone the repository
```
git clone https://github.com/SamiJuv/tracker.git
```
2. cd to the tracker folder
```
cd tracker
```
3. Install globally with npm
```
npm install --global .
```

## Usage
### Manage projects
```
# create new project
$ tracker create-project|crproj <name>

# list projects
$ tracker list-projects|lsproj

# delete project
$ tracker delete-project|delproj

# show total time tracked to project
$ tracker total
```

### Time tracking
```
# start tracking
$ tracker start

# stop tracking
$ tracker stop [-m <message>]

# show duration of the last entry
$ tracker last-duration|dur

# list latest 10 entries
$ tracker list-entries|ls
```
