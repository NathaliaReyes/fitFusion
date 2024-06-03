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
  mutation Mutation($age: Int!, $height: Int!, $weight: Int!, $gender: String!, $level: String!, $calories: Int!) {
    addUserSecondScreen(age: $age, height: $height, weight: $weight, gender: $gender, level: $level, calories: $calories) {
      _id
      email
      username
      country
    }
  }
`;
export const UPDATE_USER_IMAGE = gql`
  mutation UpdateUserImage($imageUrl: String!) {
    updateUserImage(imageUrl: $imageUrl) {
      imageUrl
      email
      username
      _id
    }
  }
`;

export const ADD_WORKOUT_PLAN = gql`
mutation AddWorkoutPlan($name: String!, $goal: String!) {
  addWorkoutPlan(name: $name, goal: $goal) {
    name
    goal
  }
}
`;

export const  ADD_WORKOUT_PROGRESS = gql`
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
