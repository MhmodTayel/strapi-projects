## Student Feed

Different types of student feed records displayed for students
Not all of these have been designed, but these are the ones for V1:

-   Homework: when a teacher closes a lesson and homework is uploaded, they get a notification

-   Homework Marked: when a homework is marked, the percentage of mark is shown

-   Lesson Missed: when a student misses a lesson, they get a notification to watch the recording

-   Review Lesson: When the student's understanding of the lesson was deemed “struggled”, they are asked to review the lesson

-   Star Student: When a student is awarded a star student award by their teacher Behaviour: When a behavioural issue is reported by the teacher

| Name             | Feed type        | Entity                                 | Description                             | Display Untill    |
| ---------------- | ---------------- | -------------------------------------- | --------------------------------------- | ----------------- |
| Star student     | star-student     | register                               | When student is marked as start student | 30 days           |
| Lesson missed    | lesson-missed    | register                               | When student is absent                  | 30 days           |
| Behaviour issue  | behaviour-issue  | register                               | When student has behaviour issue        | 30 days           |
| New homework     | new-homework     | register / homework                    | When new homework is created            | Homework deadline |
| Homework marked  | homework-marked  | register-student / homework-submission | When homework is marked for student     | 30 days           |
| Missing homework | missing-homework | register / homework                    | When homework deadline is passed        | 30 days           |
| Review lesson    | review-lesson    | register                               | When student needs to review lesson     | 30 days           |
