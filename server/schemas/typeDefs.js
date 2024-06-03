const typeDefs = `
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        country: String!
        birthDate: String!
        imageUrl: String
        workoutPlans: [WorkoutPlan]
    }

    type WorkoutPlan {
        _id: ID
        name: String
        goal: String
        workouts: [Workout]
    }

    type Workout {
        _id: ID
        name: String!
        workoutId: Int
        bodyPart: String
        equipment: String
        gifUrl: String
        target: String
        secondary: String
        instructions: String
        progress: [Progress]
    }

    type Progress {
        _id: ID
        date: String!
        sets: Int
        reps: Int
        weight: Int
        duration: Int
        distance: Int
    }

    type Auth {
        token: ID!
        user: User
    }

    input WorkoutInput {
        name: String!
        workoutId: Int
        bodyPart: String
        equipment: String
        gifUrl: String
        target: String
        secondary: String
        instructions: String
    }

    input ProgressInput {
        sets: Int
        reps: Int
        weight: Int
        duration: Int
        distance: Int
    }

    type Query {
        me: User

        allUsers: [User]
        myWorkoutPlans: [WorkoutPlan]



    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!, country: String!, birthDate: String!): Auth
        addUserSecondScreen(age: Int!, height: Int!, weight: Int!, gender: String!, level: String!, calories: Int!): User
        login(email: String!, password: String!): Auth
        updateUserImage(imageUrl: String!): User

        addWorkoutPlan(name: String!, goal: String): WorkoutPlan
        updateWorkoutPlan(workoutPlanId: ID!, name: String): WorkoutPlan
        removeWorkoutPlan(workoutPlanId: ID!): WorkoutPlan

        addWorkout(workoutPlanId: ID!, workoutInput: WorkoutInput!): WorkoutPlan
        removeWorkout(workoutPlanId: ID!, workoutId: ID!): WorkoutPlan

        addWorkoutProgress(workoutPlanId: ID!, workoutId: ID!, progressInput: ProgressInput!): WorkoutPlan
    }
`

module.exports = typeDefs;