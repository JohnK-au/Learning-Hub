# List of questions for Claude after the flight

I would like Claude to answer the questions here, storing the answer to each question just below its associated question.

1. When there is an export prior to function ..., what is the export doing?

2. I am a bit confused about how these functions work, like nextLessonInTrack. Can you walk through how it works and how it flows through the code?

3. Why does track.id work when the only variable in the function was track: Track?

4. I'm confused how this works:

): Lesson | null {
const completed = new Set(
progress.tracks[track.id]?.completedLessonIds ?? [],
);

5. How am I supposed to know when it is track.modules or modules.lessons?

6. I'm also confused how you know what to define a variable as in a function. For example, how did you know to define streak as ProgressState["streak"]?

7. I'm still confused about the scheduler dueReviews function. So I understand in principle that I am looking at the dictionary containing the lessonId and its review state, as an array. I am returning the lesson ids that have a review state that is today? I am confused what the 'review' variable passed into the ReviewIsDue function is and where it comes from?

8. I don't understand what you mean by destructuring in the syntax cheat sheet ('grab a field into a variable')?

9. I don't understand TODO #5 at all. I copied the solution so I could keep going forward but I don't understand how the code works. We need to go through line by line because I think there are some fundamental concepts and syntax I just don't understand. I definitely don't understand what 'args' is.
