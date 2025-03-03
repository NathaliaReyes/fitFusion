import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_WORKOUT, UPDATE_WORKOUT_GOAL, ADD_WORKOUT_PROGRESS } from '../utils/mutations';
import ExerciseForm from '../components/workoutPlans/ExerciseForm';
import ExerciseCompletionForm from '../components/workoutPlans/ExerciseCompletionForm';
import ButtonAddWorkout from '../components/workoutPlans/ButtonAddWorkout';
import ButtonRemoveExercise from '../components/workoutPlans/ButtonRemoveExercise';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { I18nContext } from '../../I18n';
import { WorkoutContext } from '../context/WorkoutContext';
import { init } from 'i18next';
import Colors from '../styles/colors';

const EachPlan = ({ navigation, route }) => {
  const { i18n } = useContext(I18nContext);
  const { planId } = route.params;
  const [isGoalFormVisible, setIsGoalFormVisible] = useState(false);
  const [isCompletionFormVisible, setIsCompletionFormVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_ME);
  const [isEditing, setIsEditing] = useState(false);
  const { setCurrentWorkoutId } = useContext(WorkoutContext);
  const [removeWorkout] = useMutation(REMOVE_WORKOUT);
  const [updateGoal] = useMutation(UPDATE_WORKOUT_GOAL);
  const [saveProgress] = useMutation(ADD_WORKOUT_PROGRESS);
  const [goalComplete, setGoalComplete] = useState({});

  useEffect(() => {
    if (data) {
      const initialGoalCompleteState = {};
      data.me.workoutPlans.forEach(plan => {
        plan.workouts.forEach(workout => {
          workout.goal.forEach(goal => {
            initialGoalCompleteState[goal._id] = goal.isComplete || false;
          })
        })
      })
      setGoalComplete(initialGoalCompleteState);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  
  useLayoutEffect(() => {

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MyWorkouts')}>
          <Ionicons style={styles.arrow} name="arrow-back" size={24} color="black" marginBottom="200" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  if (loading) return <Text>{i18n.t('Loading')}...</Text>;

  if (error) {
    console.log(error);
    // return <Text>Error: {error.message}</Text>;
  }

  const { me: { workoutPlans } } = data;
  const currentPlan = workoutPlans.find(plan => plan._id === planId);

  if (!currentPlan) {
    return <Text>{i18n.t('Workout Plan not found')}</Text>;
  }

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();
  console.log(todayDate);

  const handleExerciseClick = (exercise) => {
    setCurrentExercise(exercise);
    navigation.navigate('ExerciseDetail', { exercise, planId: currentPlan._id });
  };

  const handleComplete = async (workout, goalId) => {
    const goal = workout.goal.find(g => g._id === goalId)
    console.log("this is goal.date", goal.date);
    const input = {
      sets: goal.sets,
      reps: goal.reps,
      weight: goal.weight,
      duration: goal.duration,
      distance: goal.distance
    }
    try {
      await updateGoal({
        variables: {
          workoutPlanId: planId,
          workoutId: workout._id,
          goalId: goal._id,
          isComplete: true,
        },
      })

      await saveProgress({
        variables: {
          workoutPlanId: planId,
          workoutId: workout._id,
          progressInput: input,
        }
      })

      setGoalComplete(prevState => ({ ...prevState, [goalId]: true}));

      refetch();

      Alert.alert(i18n.t('congratulations'));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSetGoal = (exercise) => {
    setCurrentExercise(exercise);
    setIsGoalFormVisible(true);
  };

  const handleGoalFormSave = (data) => {
    setIsGoalFormVisible(false);
  };

  const handleCompletionFormSave = (data) => {
    setIsCompletionFormVisible(false);
  };

  const handleAdd = () => {
    setCurrentWorkoutId(planId);
    navigation.navigate('SearchByNameScreen');
  };

  const handleRemove = async (workoutPlanName, exerciseName, exerciseId) => {
    Alert.alert(
      "Delete exercise from workout plan",
      `Are you sure you want to delete ${exerciseName} from the ${workoutPlanName} workout plan?`,
      [
        {
          text: "No",
          onPress: () => console.log("Deletion cancelled by user."),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {

            try {
              const { data } = await removeWorkout({
                variables: { workoutPlanId: planId, workoutId: exerciseId },
              });
              refetch();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to remove exercise from workout plan');
            }
          }
        }
      ],
      { cancelable: false }
    );


  };

  const handleRename = (id, workoutPlanName, workoutPlanGoal) => {
    navigation.navigate('EditWorkoutForm', { id, workoutPlanName, workoutPlanGoal });

  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => handleRename(currentPlan._id, currentPlan.name, currentPlan.goal)}
          style={styles.iconButton}>
          <Icon name={isEditing ? "save" : "edit"} size={24} color={Colors.primaryVariant} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentPlan.name}</Text>
          <Text style={styles.subtitle}>{i18n.t('Goal')}: {currentPlan.goal}</Text>
        </View>

        <Text style={styles.subtitle}>{i18n.t('workouts')}:</Text>

        {currentPlan.workouts.map((workout, workoutIndex) => {
          const todayGoal = workout.goal.find(goal => goal.date === todayDate);
          const hasTodayGoal = !!todayGoal;
        
        
        return (
          <View key={`${workout._id}_${workoutIndex}`} style={styles.workoutContainer}>
            <View style={styles.workoutBlock}>
              <TouchableOpacity
                key={`${workout._id}_touch`}
                onPress={() => handleExerciseClick(workout, currentPlan._id)}
                style={styles.workoutCard}
              >
                <Text style={styles.workout}>{workout.name}</Text>
                <ButtonRemoveExercise
                  onPress={() => handleRemove(currentPlan.name, workout.name, workout._id)}
                />
              </TouchableOpacity>
              {workout.goal && workout.goal.length > 0 ? (
                workout.goal.map((goal, goalIndex) => (
                  <React.Fragment key={`${goal._id}_${goalIndex}`}>
                    {goal.date === todayDate ? (
                     goal.isComplete ? (
                      <Text key={`${goal._id}_completedToday`} style={styles.subtitle}>{i18n.t("Completed Today's Goal")}</Text>
                     ) : (
                      <React.Fragment key={`${goal._id}_incomplete`}>
                        <TouchableOpacity
                          key={`${goal._id}_touch`}
                          onPress={() => handleExerciseClick(workout)}
                          style={styles.workoutCard}
                        >
                          {goal.sets !== null && goal.reps !== null && goal.weight !== null ? (
                            <Text style={styles.workout}>
                              {i18n.t('Sets')}: {goal.sets} Reps: {goal.reps} {i18n.t('Weight')}: {goal.weight}
                            </Text>
                          ) : (
                            <Text style={styles.workout}>
                              {i18n.t('Duration')}: {goal.duration} {i18n.t('Distance')}: {goal.distance}
                            </Text>
                          )}
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            onPress={() => handleComplete(workout, goal._id)}
                            style={styles.completeButton}
                          >
                            <Text style={styles.completeButtonText}>{i18n.t('Complete')}</Text>
                          </TouchableOpacity>
                        </View>
                      </React.Fragment>
                     )
                    ) : (
                      !hasTodayGoal && goalIndex === workout.goal.length - 1 && (
                      <View style={styles.buttonContainer} key={`${workout._id}_setgoal`}>
                      <TouchableOpacity
                        onPress={() => handleSetGoal(workout, planId)}
                        style={styles.setGoalButton}
                      >
                        <Text style={styles.setGoalButtonText}>{i18n.t('Set New Goal')}</Text>
                      </TouchableOpacity>
                    </View>
                      )
                    )}
                  </React.Fragment>
                ))
              ) : (
                <View style={styles.buttonContainer} key={`${workout._id}_setgoal`}>
                  <TouchableOpacity
                    onPress={() => handleSetGoal(workout, planId)}
                    style={styles.setGoalButton}
                  >
                    <Text style={styles.setGoalButtonText}>{i18n.t('Set New Goal')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )} )}


        {isGoalFormVisible && currentExercise && (
          <ExerciseForm
            visible={isGoalFormVisible}
            onClose={() => setIsGoalFormVisible(false)}
            onSave={handleGoalFormSave}
            exercise={currentExercise}
            workoutPlanId={planId}
            workoutId={currentExercise._id}
          />
        )}

        {isCompletionFormVisible && currentExercise && (
          <ExerciseCompletionForm
            visible={isCompletionFormVisible}
            onClose={() => setIsCompletionFormVisible(false)}
            onSave={handleCompletionFormSave}
            exercise={currentExercise}
            workoutPlanId={planId}
            workoutId={currentExercise._id}
          />
        )}
      </View>
      <ButtonAddWorkout onPress={handleAdd} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    // flex: 1,
    alignItems: 'center',
    // marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
  },
  iconButton: {
    marginLeft: 10,
  },
  workoutContainer: {
    width: '100%',
    marginBottom: 20,
  },
  workoutBlock: {
    marginBottom: 20,
    alignItems: 'center',
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    width: '100%',
    borderRadius: 10,
  },
  workout: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: Colors.calendarCheck,
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
  },
  congratulations: {
    backgroundColor: Colors.calendarCheck,
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  setGoalButton: {
    backgroundColor: Colors.secondaryVariant,
    padding: 8,
    borderRadius: 5,
    flex: 1,
  },
  setGoalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 3,
  },
  arrow: {
    marginLeft: 20,
  },
});

export default EachPlan;
