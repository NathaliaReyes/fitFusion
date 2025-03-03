import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!, $country: String!, $birthDate: String!) {
    addUser(username: $username, email: $email, password: $password, country: $country, birthDate: $birthDate) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_USER_SECOND_SCREEN = gql`
  mutation Mutation($height: Int!, $weight: Int!, $gender: String!, $level: String!, $calories: Int) {
    addUserSecondScreen(height: $height, weight: $weight, gender: $gender, level: $level, calories: $calories) {
      _id
      email
      username
      country
    }
  }
`;

export const UPDATE_PROFILE_PIC = gql`
mutation Mutation($profilePic: ProfilePicInput!) {
  updateProfilePic(profilePic: $profilePic) {
    profilePic {
      data
      contentType
    }
  }
}
`;

export const ADD_WORKOUT_PLAN = gql`
mutation AddWorkoutPlan($name: String!, $goal: String!) {
  addWorkoutPlan(name: $name, goal: $goal) {
    _id
    name
    goal
    date
  }
}
`;


export const ADD_WORKOUT = gql`
mutation AddWorkout($workoutPlanId: ID!, $workoutInput: WorkoutInput!) {
  addWorkout(workoutPlanId: $workoutPlanId, workoutInput: $workoutInput) {
    _id
    workouts {
      name
      workoutId
      bodyPart
      equipment
      gifUrl
      target
      instructions
      secondary
    }
  }
}
`;

export const ADD_WORKOUT_PROGRESS = gql`
mutation AddWorkoutProgress($workoutPlanId: ID!, $workoutId: ID!, $progressInput: ProgressInput!) {
  addWorkoutProgress(workoutPlanId: $workoutPlanId, workoutId: $workoutId, progressInput: $progressInput) {
    _id
    goal
    name
    workouts {
      _id
      name
      bodyPart
      progress {
        _id
        date
        distance
        duration
        reps
        sets
        weight
      }
    }
  }
}
`;

export const ADD_WORKOUT_GOAL = gql`
mutation AddWorkoutGoal($workoutPlanId: ID!, $workoutId: ID!, $goalInput: GoalInput!) {
  addWorkoutGoal(workoutPlanId: $workoutPlanId, workoutId: $workoutId, goalInput: $goalInput) {
    _id
    name
    goal
    workouts {
      _id
      name
      bodyPart
      goal {
        sets
        reps
        weight
        duration
        distance
        isComplete
      }
    }
  }
}
`
export const UPDATE_WORKOUT_GOAL = gql`
mutation Mutation($workoutPlanId: ID!, $workoutId: ID!, $goalId: ID!, $isComplete: Boolean!) {
  updateWorkoutGoal(workoutPlanId: $workoutPlanId, workoutId: $workoutId, goalId: $goalId, isComplete: $isComplete) {
    workouts {
      goal {
        isComplete
      }
    }
  }
}
`

export const UPDATE_WORKOUT_PLAN_NAME = gql`
  mutation UpdateWorkoutPlanName($planId: ID!, $newName: String!) {
    updateWorkoutPlanName(planId: $planId, newName: $newName) {
      _id
      name
    }
  }
`;

export const REMOVE_WORKOUT_PLAN = gql`
mutation RemoveWorkoutPlan($workoutPlanId: ID!) {
  removeWorkoutPlan(workoutPlanId: $workoutPlanId) {
    _id
  }
}
`;

export const REMOVE_WORKOUT = gql`
mutation RemoveWorkout($workoutPlanId: ID!, $workoutId: ID!) {
  removeWorkout(workoutPlanId: $workoutPlanId, workoutId: $workoutId) {
    _id
  }
}
`;

export const UPDATE_WORKOUT_PLAN = gql`
mutation UpdateWorkoutPlan($workoutPlanId: ID!, $name: String, $goal: String) {
  updateWorkoutPlan(workoutPlanId: $workoutPlanId, name: $name, goal: $goal) {
    _id
    name
    goal
  }
}
`;