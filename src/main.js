import { CourseManager } from './components/CourseManager.js';
import { ExcelGrid } from './components/ExcelGrid.js';
import { Overview } from './components/Overview.js';
import { exerciseAPI, examAPI } from './api/client.js';

class GradeTrackerApp {
    constructor() {
        this.courseManager = new CourseManager();
        this.exerciseGrid = null;
        this.examGrid = null;
        this.exercises = [];
        this.exams = [];
        this.overview = null;

        this.init();
    }

    async init() {
        // Set up course manager callbacks
        this.courseManager.onCourseSelect = (course) => this.handleCourseSelect(course);
        this.courseManager.onCourseChange = () => this.updateCourseView();

        // Load courses
        await this.courseManager.loadCourses();

        // Set up event listeners
        this.setupEventListeners();

        // Select first course if available
        if (this.courseManager.courses.length > 0) {
            this.courseManager.selectCourse(this.courseManager.courses[0].id);
        }
    }

    setupEventListeners() {
        // Overview button
        document.getElementById('overviewBtn').addEventListener('click', () => {
            this.showOverview();
        });

        // New course button
        document.getElementById('newCourseBtn').addEventListener('click', () => {
            this.courseManager.showCourseModal();
        });

        // Edit course button
        document.getElementById('editCourseBtn').addEventListener('click', () => {
            if (this.courseManager.currentCourse) {
                this.courseManager.showCourseModal(this.courseManager.currentCourse);
            }
        });

        // Delete course button
        document.getElementById('deleteCourseBtn').addEventListener('click', async () => {
            if (!this.courseManager.currentCourse) return;

            const confirmed = confirm(
                `Are you sure you want to delete "${this.courseManager.currentCourse.name}"? This will also delete all exercises and exams.`
            );

            if (confirmed) {
                await this.courseManager.deleteCourse(this.courseManager.currentCourse.id);
                this.showWelcomeScreen();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Add exercise button
        document.getElementById('addExerciseBtn').addEventListener('click', () => {
            this.addExercise();
        });

        // Add exam button
        document.getElementById('addExamBtn').addEventListener('click', () => {
            this.addExam();
        });
    }

    async handleCourseSelect(course) {
        // Hide welcome screen and overview, show course view
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('overviewView').style.display = 'none';
        document.getElementById('courseView').style.display = 'block';

        // Update course header
        document.getElementById('courseName').textContent = course.name;
        document.getElementById('courseSemester').textContent = course.semester || '';
        document.getElementById('courseCredits').textContent = course.credits ? `${course.credits} ECTS` : '';

        // Load exercises and exams
        await this.loadExercises(course.id);
        await this.loadExams(course.id);

        // Render grids
        this.renderExerciseGrid();
        this.renderExamGrid();

        // Update stats
        this.updateStats();
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('courseView').style.display = 'none';
    }

    updateCourseView() {
        if (this.courseManager.currentCourse) {
            const course = this.courseManager.courses.find(
                c => c.id === this.courseManager.currentCourse.id
            );
            if (course) {
                document.getElementById('courseName').textContent = course.name;
                document.getElementById('courseSemester').textContent = course.semester || '';
                document.getElementById('courseCredits').textContent = course.credits ? `${course.credits} ECTS` : '';
            }
        }
    }

    async showOverview() {
        // Hide other views
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('courseView').style.display = 'none';
        document.getElementById('overviewView').style.display = 'block';

        // Create and render overview
        this.overview = new Overview(this.courseManager.courses, (courseId) => {
            this.courseManager.selectCourse(courseId);
        });

        await this.overview.render(document.getElementById('overviewView'));
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    async loadExercises(courseId) {
        try {
            this.exercises = await exerciseAPI.getByCourse(courseId);
        } catch (error) {
            console.error('Failed to load exercises:', error);
            this.exercises = [];
        }
    }

    async loadExams(courseId) {
        try {
            this.exams = await examAPI.getByCourse(courseId);
        } catch (error) {
            console.error('Failed to load exams:', error);
            this.exams = [];
        }
    }

    renderExerciseGrid() {
        const container = document.getElementById('exerciseGrid');

        const columns = [
            {
                field: 'exercise_number',
                label: 'Exercise #',
                type: 'number',
                className: 'col-number',
                min: 1,
                step: 1,
            },
            {
                field: 'points_earned',
                label: 'Points Earned',
                type: 'number',
                className: 'col-points',
                min: 0,
                step: 0.01,
                format: (val) => val !== null && val !== undefined ? val.toFixed(2) : '0.00',
            },
            {
                field: 'points_possible',
                label: 'Points Possible',
                type: 'number',
                className: 'col-points',
                min: 0,
                step: 0.01,
                format: (val) => val !== null && val !== undefined ? val.toFixed(2) : '0.00',
            },
            {
                field: 'percentage',
                label: 'Percentage',
                editable: false,
                className: 'col-points',
                render: (val, row) => {
                    const pct = row.points_possible > 0
                        ? (row.points_earned / row.points_possible * 100).toFixed(2)
                        : '0.00';
                    return `
            <div class="percentage-bar">
              <div class="percentage-fill">
                <div class="percentage-fill-inner" style="width: ${pct}%"></div>
              </div>
              <span class="percentage-text">${pct}%</span>
            </div>
          `;
                },
            },
            {
                field: 'notes',
                label: 'Notes',
                type: 'text',
                className: 'col-notes',
            },
        ];

        // Reuse existing grid if it exists, otherwise create new one
        if (this.exerciseGrid) {
            this.exerciseGrid.updateData(this.exercises);
        } else {
            this.exerciseGrid = new ExcelGrid(container, {
                columns,
                data: this.exercises,
                onCellChange: async (rowIndex, field, value, row) => {
                    try {
                        await exerciseAPI.update(row.id, {
                            exercise_number: row.exercise_number,
                            points_earned: row.points_earned,
                            points_possible: row.points_possible,
                            notes: row.notes,
                        });
                        this.updateStats();
                    } catch (error) {
                        console.error('Failed to update exercise:', error);
                        alert('Failed to save changes');
                    }
                },
                onRowDelete: async (rowIndex, row) => {
                    try {
                        await exerciseAPI.delete(row.id);
                        this.exercises.splice(rowIndex, 1);
                        this.exerciseGrid.updateData(this.exercises);
                        this.updateStats();
                    } catch (error) {
                        console.error('Failed to delete exercise:', error);
                        alert('Failed to delete exercise');
                    }
                },
                onRowReorder: async (reorderedData) => {
                    try {
                        // Update local data
                        this.exercises = reorderedData;

                        // Send reorder information to server
                        await exerciseAPI.reorder(
                            this.exercises.map(ex => ({ id: ex.id, sort_order: ex.sort_order }))
                        );
                    } catch (error) {
                        console.error('Failed to reorder exercises:', error);
                        alert('Failed to save new order');
                    }
                },
            });
        }
    }

    renderExamGrid() {
        const container = document.getElementById('examGrid');

        const columns = [
            {
                field: 'exam_name',
                label: 'Exam Name',
                type: 'text',
            },
            {
                field: 'grade',
                label: 'Grade',
                type: 'number',
                className: 'col-grade',
                min: 0,
                step: 0.01,
                format: (val) => val !== null && val !== undefined ? val.toFixed(2) : '-',
            },
            {
                field: 'max_grade',
                label: 'Max Grade',
                type: 'number',
                className: 'col-grade',
                min: 0,
                step: 0.01,
                format: (val) => val !== null && val !== undefined ? val.toFixed(2) : '100.00',
            },
            {
                field: 'weight',
                label: 'Weight',
                type: 'number',
                className: 'col-weight',
                min: 0,
                step: 0.01,
                format: (val) => val !== null && val !== undefined ? val.toFixed(2) : '1.00',
            },
            {
                field: 'exam_date',
                label: 'Date',
                type: 'text',
                className: 'col-date',
            },
        ];

        // Reuse existing grid if it exists, otherwise create new one
        if (this.examGrid) {
            this.examGrid.updateData(this.exams);
        } else {
            this.examGrid = new ExcelGrid(container, {
                columns,
                data: this.exams,
                onCellChange: async (rowIndex, field, value, row) => {
                    try {
                        await examAPI.update(row.id, {
                            exam_name: row.exam_name,
                            grade: row.grade,
                            max_grade: row.max_grade,
                            weight: row.weight,
                            exam_date: row.exam_date,
                        });
                        this.updateStats();
                    } catch (error) {
                        console.error('Failed to update exam:', error);
                        alert('Failed to save changes');
                    }
                },
                onRowDelete: async (rowIndex, row) => {
                    try {
                        await examAPI.delete(row.id);
                        this.exams.splice(rowIndex, 1);
                        this.examGrid.updateData(this.exams);
                        this.updateStats();
                    } catch (error) {
                        console.error('Failed to delete exam:', error);
                        alert('Failed to delete exam');
                    }
                },
                onRowReorder: async (reorderedData) => {
                    try {
                        // Update local data
                        this.exams = reorderedData;

                        // Send reorder information to server
                        await examAPI.reorder(
                            this.exams.map(ex => ({ id: ex.id, sort_order: ex.sort_order }))
                        );
                    } catch (error) {
                        console.error('Failed to reorder exams:', error);
                        alert('Failed to save new order');
                    }
                },
            });
        }
    }

    async addExercise() {
        if (!this.courseManager.currentCourse) return;

        const nextNumber = this.exercises.length > 0
            ? Math.max(...this.exercises.map(e => e.exercise_number)) + 1
            : 1;

        try {
            const newExercise = await exerciseAPI.create({
                course_id: this.courseManager.currentCourse.id,
                exercise_number: nextNumber,
                points_earned: 0,
                points_possible: 10,
                notes: '',
            });

            this.exercises.push(newExercise);
            this.exerciseGrid.updateData(this.exercises);
            this.updateStats();
        } catch (error) {
            console.error('Failed to add exercise:', error);
            alert('Failed to add exercise');
        }
    }

    async addExam() {
        if (!this.courseManager.currentCourse) return;

        try {
            const newExam = await examAPI.create({
                course_id: this.courseManager.currentCourse.id,
                exam_name: 'New Exam',
                grade: null,
                max_grade: 100,
                weight: 1.0,
                exam_date: null,
            });

            this.exams.push(newExam);
            this.examGrid.updateData(this.exams);
            this.updateStats();
        } catch (error) {
            console.error('Failed to add exam:', error);
            alert('Failed to add exam');
        }
    }

    updateStats() {
        // Exercise stats
        const totalEarned = this.exercises.reduce((sum, ex) => sum + (ex.points_earned || 0), 0);
        const totalPossible = this.exercises.reduce((sum, ex) => sum + (ex.points_possible || 0), 0);
        const percentage = totalPossible > 0 ? (totalEarned / totalPossible * 100).toFixed(2) : '0.00';

        document.getElementById('totalPoints').textContent = `${totalEarned.toFixed(2)} / ${totalPossible.toFixed(2)}`;
        document.getElementById('exercisePercentage').textContent = `${percentage}%`;

        // Exam stats
        const validExams = this.exams.filter(ex => ex.grade !== null && ex.grade !== undefined);

        if (validExams.length > 0) {
            const avgGrade = validExams.reduce((sum, ex) => sum + ex.grade, 0) / validExams.length;
            document.getElementById('averageGrade').textContent = avgGrade.toFixed(2);

            const totalWeight = validExams.reduce((sum, ex) => sum + (ex.weight || 1), 0);
            const weightedSum = validExams.reduce((sum, ex) => sum + (ex.grade * (ex.weight || 1)), 0);
            const weightedAvg = weightedSum / totalWeight;
            document.getElementById('weightedAverage').textContent = weightedAvg.toFixed(2);
        } else {
            document.getElementById('averageGrade').textContent = '-';
            document.getElementById('weightedAverage').textContent = '-';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GradeTrackerApp();
});
