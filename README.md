# University Grade Tracker

A modern, Excel-like web application for tracking university course grades, exercise points, and exam results with real-time statistics and an intuitive interface.

![University Grade Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### Course Management
- **Multiple Course Support**: Track grades for all your university courses in one place
- **Course Details**: Store course name, semester, and ECTS credits
- **Organized Sidebar**: Quick access to all your courses with an intuitive navigation

### Exercise Tracking
- **Excel-like Grid Interface**: Familiar spreadsheet-style editing experience
- **Track Points**: Record earned points vs. possible points for each exercise
- **Automatic Percentage Calculation**: Visual percentage bars for instant progress feedback
- **Notes Field**: Add personal notes for each exercise
- **Drag-and-Drop Reordering**: Easily reorganize exercises

### Exam Management
- **Flexible Grading**: Support for different grading scales with customizable max grades
- **Weighted Averages**: Assign weights to different exams
- **Average Calculations**: Automatic simple and weighted average grade calculation
- **Exam Dates**: Track when exams are scheduled or completed

### Real-Time Statistics
- **Exercise Stats**: Total points earned/possible and overall percentage
- **Exam Stats**: Average grade and weighted average across all exams
- **Overview Dashboard**: Comprehensive view of all courses and their performance

### Data Persistence
- **SQLite Database**: All data stored locally using Better-SQLite3
- **Auto-Save**: Changes are automatically saved as you type
- **Reliable Storage**: No data loss on page refresh

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grade-tracker.git
   cd grade-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Build for Production

```bash
npm run build
npm run preview
```

## Technology Stack

### Frontend
- **Vanilla JavaScript (ES6+)**: Modern JavaScript with modules
- **Vite**: Fast development server and build tool
- **CSS3**: Custom styling with Inter font from Google Fonts
- **Modular Architecture**: Component-based structure

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **Better-SQLite3**: Fast, synchronous SQLite database
- **CORS**: Cross-origin resource sharing support

### Database Schema
- **Courses**: Store course information (name, semester, credits)
- **Exercises**: Track exercise points per course
- **Exams**: Record exam grades and weights

## Project Structure

```
grade-tracker/
├── src/
│   ├── api/
│   │   └── client.js          # API client for frontend
│   ├── components/
│   │   ├── CourseManager.js   # Course CRUD operations
│   │   ├── ExcelGrid.js       # Spreadsheet-like grid component
│   │   └── Overview.js        # Overview dashboard
│   ├── styles/
│   │   ├── grid.css          # Grid component styles
│   │   ├── index.css         # Main application styles
│   │   └── overview.css      # Overview page styles
│   └── main.js               # Application entry point
├── server/
│   ├── api.js                # Express REST API
│   └── db.js                 # Database schema and operations
├── index.html                # Main HTML file
├── vite.config.js            # Vite configuration
├── package.json              # Project dependencies
└── grades.db                 # SQLite database (auto-generated)
```

## Usage

### Creating a Course
1. Click the **"New Course"** button in the header
2. Fill in course name, semester, and credits
3. Click **"Save"**

### Adding Exercises
1. Select a course from the sidebar
2. Navigate to the **"Exercises"** tab
3. Click **"Add Exercise"**
4. Edit the fields directly in the grid:
   - Exercise number
   - Points earned
   - Points possible
   - Notes

### Adding Exams
1. Select a course from the sidebar
2. Navigate to the **"Exams"** tab
3. Click **"Add Exam"**
4. Edit the fields:
   - Exam name
   - Grade received
   - Maximum grade (default: 100)
   - Weight (for calculating weighted average)
   - Exam date

### Viewing Overview
- Click the **"Overview"** button to see all courses and their statistics at a glance

### Reordering Items
- Drag the handle on the left side of any row to reorder exercises or exams

### Deleting Items
- Click the trash icon on any row to delete an exercise or exam
- Click **"Delete"** button on a course to remove it (with confirmation)

## Key Features in Detail

### Excel-Like Grid
The `ExcelGrid` component provides a familiar spreadsheet interface with:
- Inline editing
- Automatic saving
- Custom cell formatting
- Percentage visualization
- Drag-and-drop reordering

### Automatic Calculations
- **Exercise Percentage**: `(Total Earned / Total Possible) × 100`
- **Average Grade**: Simple mean of all exam grades
- **Weighted Average**: `Σ(Grade × Weight) / Σ(Weight)`

### Responsive Design
- Clean, modern UI with Inter font
- Sidebar navigation
- Tab-based interface for exercises and exams
- Visual feedback for all interactions

## API Endpoints

The application uses a REST API with the following endpoints:

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Exercises
- `GET /api/exercises/course/:courseId` - Get exercises for a course
- `POST /api/exercises` - Create a new exercise
- `PUT /api/exercises/:id` - Update an exercise
- `DELETE /api/exercises/:id` - Delete an exercise
- `PUT /api/exercises/reorder` - Reorder exercises

### Exams
- `GET /api/exams/course/:courseId` - Get exams for a course
- `POST /api/exams` - Create a new exam
- `PUT /api/exams/:id` - Update an exam
- `DELETE /api/exams/:id` - Delete an exam
- `PUT /api/exams/reorder` - Reorder exams

## Known Issues & Fixes

- **Delete Button Bug** (Fixed): Previously, the delete function would ask for confirmation multiple times. This has been resolved by properly managing event listeners.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## Acknowledgments

- Built with modern web technologies
- Inspired by the need for simple, effective grade tracking
- Designed for university students managing multiple courses

---

Made with care for students tracking their academic progress
