# My Tutor+ Backend Implementation Guide

Complete backend architecture guide for building the My Tutor+ Learning Management System for Nigerian secondary schools (SS1-SS3).

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Option A: Laravel Backend](#option-a-laravel-backend)
4. [Option B: Next.js Backend (API Routes/Server Actions)](#option-b-nextjs-backend)
5. [Payment Integration](#payment-integration)
6. [Real-time Features](#real-time-features)
7. [File Storage](#file-storage)
8. [Security Considerations](#security-considerations)
9. [Deployment Guide](#deployment-guide)

---

## System Overview

### Core Requirements
- **User Roles**: Student, Instructor, Admin
- **Class Levels**: SS1, SS2, SS3
- **Key Features**: 
  - Course enrollment with payment processing
  - Live class scheduling (Google Meet)
  - Recorded lessons (YouTube integration)
  - Assignments/Quizzes with grading
  - Attendance tracking
  - Real-time messaging
  - Admin payment confirmation
  - Analytics & reporting

### Tech Stack Comparison

| Feature | Laravel | Next.js (with Supabase/Prisma) |
|---------|---------|--------------------------------|
| Development Speed | Moderate | Fast |
| Real-time | Laravel Echo + Pusher | Supabase Realtime / Socket.io |
| Auth | Laravel Sanctum/Passport | NextAuth.js / Supabase Auth |
| ORM | Eloquent | Prisma / Supabase SDK |
| File Storage | Laravel Storage + S3 | Vercel Blob / Supabase Storage |
| Hosting | VPS/Cloud (DigitalOcean) | Vercel / Netlify |
| Cost (Nigeria) | $10-50/month | $0-20/month (free tier) |

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('student', 'instructor', 'admin') NOT NULL,
  class_level ENUM('SS1', 'SS2', 'SS3') NULL, -- Only for students
  phone_number VARCHAR(20),
  profile_picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_class_level ON users(class_level);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_level ENUM('SS1', 'SS2', 'SS3') NOT NULL,
  subject VARCHAR(100) NOT NULL, -- e.g., Mathematics, English, Physics
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'NGN',
  thumbnail_url TEXT,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  max_students INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_class_level ON courses(class_level);
CREATE INDEX idx_courses_status ON courses(status);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  payment_status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
  payment_reference VARCHAR(255) UNIQUE,
  amount_paid DECIMAL(10, 2),
  payment_method VARCHAR(50), -- paystack, flutterwave, stripe
  confirmed_by UUID REFERENCES users(id) NULL, -- Admin who confirmed
  confirmed_at TIMESTAMP NULL,
  receipt_url TEXT NULL,
  progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
  completed_at TIMESTAMP NULL,
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_payment_status ON enrollments(payment_status);
```

### Lessons Table
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL,
  lesson_type ENUM('video', 'document', 'quiz', 'live') NOT NULL,
  content_url TEXT, -- YouTube URL or file URL
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT false, -- Preview lessons
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
```

### Assignments Table
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  class_level ENUM('SS1', 'SS2', 'SS3') NOT NULL, -- NEW: Target class
  due_date TIMESTAMP NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_class_level ON assignments(class_level);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

### Assignment Submissions Table
```sql
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_text TEXT,
  attachment_url TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  grade DECIMAL(5, 2) NULL,
  feedback TEXT NULL,
  graded_by UUID REFERENCES users(id) NULL,
  graded_at TIMESTAMP NULL,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
```

### Live Classes Table
```sql
CREATE TABLE live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  google_meet_link TEXT,
  status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_live_classes_course ON live_classes(course_id);
CREATE INDEX idx_live_classes_scheduled ON live_classes(scheduled_at);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID REFERENCES live_classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  duration_minutes INTEGER,
  UNIQUE(live_class_id, student_id)
);

CREATE INDEX idx_attendance_class ON attendance(live_class_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) NULL, -- Optional context
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50), -- assignment, payment, class, message
  reference_id UUID NULL, -- ID of related entity
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### Analytics/Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100), -- login, course_view, lesson_complete, etc.
  reference_id UUID NULL,
  metadata JSONB, -- Additional data
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);
```

---

## Option A: Laravel Backend

### 1. Project Setup

```bash
# Create new Laravel project
composer create-project laravel/laravel mytutor-api
cd mytutor-api

# Install required packages
composer require laravel/sanctum
composer require pusher/pusher-php-server
composer require intervention/image
composer require spatie/laravel-permission
composer require maatwebsite/excel # For reports
composer require barryvdh/laravel-dompdf # For PDF receipts

# Install payment SDKs
composer require yabacon/paystack-php
composer require flutterwave/flutterwave-php
composer require stripe/stripe-php
```

### 2. Environment Configuration

```env
# .env
APP_NAME="My Tutor+"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.mytutorplus.ng

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mytutorplus
DB_USERNAME=root
DB_PASSWORD=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=mytutorplus.ng,www.mytutorplus.ng

# File Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=eu-west-1
AWS_BUCKET=mytutorplus-files

# Pusher (Real-time)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=eu

# Payment Gateways
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
STRIPE_KEY=pk_live_xxx
STRIPE_SECRET=sk_live_xxx

# Google Meet API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# YouTube API
YOUTUBE_API_KEY=
```

### 3. Models & Relationships

```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles;

    protected $fillable = [
        'email', 'password', 'full_name', 'role', 
        'class_level', 'phone_number', 'profile_picture_url'
    ];

    protected $hidden = ['password'];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function taughtCourses()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class, 'student_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }
}
```

```php
// app/Models/Course.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'description', 'instructor_id', 'class_level',
        'subject', 'price', 'thumbnail_url', 'status', 'max_students'
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('lesson_order');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function liveClasses()
    {
        return $this->hasMany(LiveClass::class);
    }
}
```

```php
// app/Models/Assignment.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = [
        'course_id', 'instructor_id', 'title', 'description',
        'class_level', 'due_date', 'total_marks', 'attachment_url'
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    // NEW: Get students from the target class level
    public function eligibleStudents()
    {
        return User::where('role', 'student')
            ->where('class_level', $this->class_level)
            ->get();
    }
}
```

### 4. API Routes

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\LiveClassController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Payment webhooks (public)
Route::post('/webhooks/paystack', [PaymentController::class, 'paystackWebhook']);
Route::post('/webhooks/flutterwave', [PaymentController::class, 'flutterwaveWebhook']);
Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Courses
    Route::apiResource('courses', CourseController::class);
    Route::get('/courses/{course}/lessons', [CourseController::class, 'lessons']);

    // Enrollments
    Route::post('/enroll', [EnrollmentController::class, 'enroll']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);

    // Assignments
    Route::middleware('role:instructor')->group(function () {
        Route::post('/assignments', [AssignmentController::class, 'create']);
        Route::put('/assignments/{assignment}', [AssignmentController::class, 'update']);
        Route::delete('/assignments/{assignment}', [AssignmentController::class, 'delete']);
        Route::get('/assignments/{assignment}/submissions', [AssignmentController::class, 'submissions']);
        Route::post('/assignments/{assignment}/grade', [AssignmentController::class, 'grade']);
    });

    Route::middleware('role:student')->group(function () {
        Route::get('/my-assignments', [AssignmentController::class, 'myAssignments']);
        Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit']);
    });

    // Live Classes
    Route::middleware('role:instructor')->group(function () {
        Route::post('/live-classes', [LiveClassController::class, 'create']);
        Route::post('/live-classes/{class}/generate-meet-link', [LiveClassController::class, 'generateMeetLink']);
    });

    Route::get('/live-classes/upcoming', [LiveClassController::class, 'upcoming']);
    Route::post('/live-classes/{class}/attendance', [LiveClassController::class, 'markAttendance']);

    // Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'send']);
    Route::post('/messages/{message}/read', [MessageController::class, 'markAsRead']);

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/pending-payments', [AdminController::class, 'pendingPayments']);
        Route::post('/admin/confirm-payment/{enrollment}', [AdminController::class, 'confirmPayment']);
        Route::get('/admin/analytics', [AdminController::class, 'analytics']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::post('/admin/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus']);
    });
});
```

### 5. Controllers

```php
// app/Http/Controllers/AssignmentController.php
<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    // Instructor creates assignment
    public function create(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'class_level' => 'required|in:SS1,SS2,SS3', // NEW
            'due_date' => 'required|date|after:now',
            'total_marks' => 'required|integer|min:1',
            'attachment' => 'nullable|file|max:10240', // 10MB
        ]);

        $validated['instructor_id'] = auth()->id();

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('assignments', 's3');
            $validated['attachment_url'] = Storage::disk('s3')->url($path);
        }

        $assignment = Assignment::create($validated);

        // Send notifications to students in the target class
        $students = User::where('role', 'student')
            ->where('class_level', $validated['class_level'])
            ->get();

        foreach ($students as $student) {
            $student->notifications()->create([
                'title' => 'New Assignment',
                'message' => "New assignment: {$assignment->title}",
                'notification_type' => 'assignment',
                'reference_id' => $assignment->id,
            ]);
        }

        return response()->json([
            'message' => 'Assignment created successfully',
            'assignment' => $assignment,
            'notified_students' => $students->count()
        ], 201);
    }

    // Student gets their assignments (filtered by class level)
    public function myAssignments(Request $request)
    {
        $user = auth()->user();

        $assignments = Assignment::with(['course', 'instructor'])
            ->where('class_level', $user->class_level)
            ->whereHas('course.enrollments', function ($query) use ($user) {
                $query->where('student_id', $user->id)
                      ->where('payment_status', 'confirmed');
            })
            ->orderBy('due_date', 'asc')
            ->get();

        // Add submission status
        $assignments = $assignments->map(function ($assignment) use ($user) {
            $submission = $assignment->submissions()
                ->where('student_id', $user->id)
                ->first();

            $assignment->submission = $submission;
            $assignment->is_submitted = $submission !== null;
            $assignment->is_graded = $submission && $submission->grade !== null;

            return $assignment;
        });

        return response()->json($assignments);
    }

    // Student submits assignment
    public function submit(Request $request, Assignment $assignment)
    {
        $user = auth()->user();

        // Verify student is in the correct class
        if ($user->class_level !== $assignment->class_level) {
            return response()->json([
                'error' => 'This assignment is not for your class level'
            ], 403);
        }

        $validated = $request->validate([
            'submission_text' => 'required|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('submissions', 's3');
            $validated['attachment_url'] = Storage::disk('s3')->url($path);
        }

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id' => $user->id,
            ],
            $validated
        );

        return response()->json([
            'message' => 'Assignment submitted successfully',
            'submission' => $submission
        ], 201);
    }

    // Instructor grades assignment
    public function grade(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'submission_id' => 'required|exists:assignment_submissions,id',
            'grade' => 'required|numeric|min:0|max:' . $assignment->total_marks,
            'feedback' => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::findOrFail($validated['submission_id']);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'],
            'graded_by' => auth()->id(),
            'graded_at' => now(),
        ]);

        // Notify student
        $submission->student->notifications()->create([
            'title' => 'Assignment Graded',
            'message' => "Your assignment '{$assignment->title}' has been graded: {$validated['grade']}/{$assignment->total_marks}",
            'notification_type' => 'assignment',
            'reference_id' => $assignment->id,
        ]);

        return response()->json([
            'message' => 'Assignment graded successfully',
            'submission' => $submission
        ]);
    }
}
```

```php
// app/Http/Controllers/AdminController.php
<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function pendingPayments()
    {
        $pendingPayments = Enrollment::with(['student', 'course'])
            ->where('payment_status', 'pending')
            ->orderBy('enrollment_date', 'desc')
            ->get();

        return response()->json($pendingPayments);
    }

    public function confirmPayment(Request $request, Enrollment $enrollment)
    {
        if ($enrollment->payment_status !== 'pending') {
            return response()->json([
                'error' => 'Payment already processed'
            ], 400);
        }

        $enrollment->update([
            'payment_status' => 'confirmed',
            'confirmed_by' => auth()->id(),
            'confirmed_at' => now(),
        ]);

        // Generate receipt PDF
        $receiptData = [
            'enrollment' => $enrollment->load(['student', 'course']),
            'receipt_number' => 'RCP-' . strtoupper(Str::random(10)),
            'confirmed_date' => now()->format('Y-m-d H:i:s'),
        ];

        $pdf = Pdf::loadView('receipts.payment', $receiptData);
        $fileName = "receipt_{$enrollment->id}.pdf";
        $path = "receipts/{$fileName}";

        Storage::disk('s3')->put($path, $pdf->output());
        $receiptUrl = Storage::disk('s3')->url($path);

        $enrollment->update(['receipt_url' => $receiptUrl]);

        // Notify student
        $enrollment->student->notifications()->create([
            'title' => 'Payment Confirmed',
            'message' => "Your payment for {$enrollment->course->title} has been confirmed.",
            'notification_type' => 'payment',
            'reference_id' => $enrollment->id,
        ]);

        return response()->json([
            'message' => 'Payment confirmed and receipt generated',
            'enrollment' => $enrollment,
            'receipt_url' => $receiptUrl
        ]);
    }

    public function analytics()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalInstructors = User::where('role', 'instructor')->count();
        $totalRevenue = Enrollment::where('payment_status', 'confirmed')->sum('amount_paid');
        $pendingPayments = Enrollment::where('payment_status', 'pending')->count();

        $studentsByClass = User::where('role', 'student')
            ->selectRaw('class_level, COUNT(*) as count')
            ->groupBy('class_level')
            ->get();

        return response()->json([
            'total_students' => $totalStudents,
            'total_instructors' => $totalInstructors,
            'total_revenue' => $totalRevenue,
            'pending_payments' => $pendingPayments,
            'students_by_class' => $studentsByClass,
        ]);
    }
}
```

### 6. Payment Integration

```php
// app/Services/PaymentService.php
<?php

namespace App\Services;

use Yabacon\Paystack;
use Flutterwave\Flutterwave;

class PaymentService
{
    public function initializePaystack($email, $amount, $reference)
    {
        $paystack = new Paystack(config('services.paystack.secret'));

        try {
            $tranx = $paystack->transaction->initialize([
                'amount' => $amount * 100, // Convert to kobo
                'email' => $email,
                'reference' => $reference,
                'callback_url' => config('app.url') . '/payment/callback',
            ]);

            return [
                'status' => true,
                'data' => $tranx->data
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function verifyPaystack($reference)
    {
        $paystack = new Paystack(config('services.paystack.secret'));

        try {
            $tranx = $paystack->transaction->verify([
                'reference' => $reference,
            ]);

            return [
                'status' => $tranx->data->status === 'success',
                'data' => $tranx->data
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
```

### 7. Real-time with Laravel Echo & Pusher

```php
// config/broadcasting.php
'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true,
        ],
    ],
],
```

```php
// app/Events/NewMessage.php
<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->message->receiver_id);
    }

    public function broadcastAs()
    {
        return 'new.message';
    }
}
```

### 8. Deployment (Laravel on DigitalOcean)

```bash
# Server setup
sudo apt update
sudo apt install nginx mysql-server php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Clone and setup
git clone https://github.com/yourusername/mytutor-api.git /var/www/mytutor-api
cd /var/www/mytutor-api
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Nginx configuration
server {
    listen 80;
    server_name api.mytutorplus.ng;
    root /var/www/mytutor-api/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.mytutorplus.ng
```

---

## Option B: Next.js Backend

### 1. Project Setup

```bash
# Using existing Next.js project
npm install @supabase/supabase-js
# OR
npm install prisma @prisma/client
npm install next-auth
npm install stripe paystack flutterwave-node-v3
```

### 2. Database Setup (Supabase)

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

### 3. Authentication with NextAuth

```javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (!user) {
          throw new Error('No user found')
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
          classLevel: user.class_level
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.classLevel = user.classLevel
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.classLevel = token.classLevel
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 4. API Routes (Next.js App Router)

```javascript
// app/api/assignments/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Fetch assignments for student (filtered by class level)
export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: assignments, error } = await supabaseAdmin
    .from('assignments')
    .select(`
      *,
      course:courses(*),
      instructor:users!instructor_id(*),
      submissions:assignment_submissions(*)
    `)
    .eq('class_level', session.user.classLevel)
    .order('due_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter to only show assignments from enrolled courses
  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('course_id')
    .eq('student_id', session.user.id)
    .eq('payment_status', 'confirmed')

  const enrolledCourseIds = enrollments.map(e => e.course_id)
  const filteredAssignments = assignments.filter(a => 
    enrolledCourseIds.includes(a.course_id)
  )

  return NextResponse.json(filteredAssignments)
}

// POST: Create assignment (Instructor only)
export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'instructor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data: assignment, error } = await supabaseAdmin
    .from('assignments')
    .insert({
      course_id: body.courseId,
      instructor_id: session.user.id,
      title: body.title,
      description: body.description,
      class_level: body.classLevel, // NEW: Target class
      due_date: body.dueDate,
      total_marks: body.totalMarks,
      attachment_url: body.attachmentUrl
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send notifications to students in target class
  const { data: students } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('role', 'student')
    .eq('class_level', body.classLevel)

  const notifications = students.map(student => ({
    user_id: student.id,
    title: 'New Assignment',
    message: `New assignment: ${body.title}`,
    notification_type: 'assignment',
    reference_id: assignment.id
  }))

  await supabaseAdmin.from('notifications').insert(notifications)

  return NextResponse.json({
    assignment,
    notified_students: students.length
  }, { status: 201 })
}
```

```javascript
// app/api/admin/confirm-payment/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabase'
import { generateReceipt } from '@/lib/pdf-generator'

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { enrollmentId } = await request.json()

  // Get enrollment details
  const { data: enrollment, error: fetchError } = await supabaseAdmin
    .from('enrollments')
    .select('*, student:users!student_id(*), course:courses(*)')
    .eq('id', enrollmentId)
    .single()

  if (fetchError || enrollment.payment_status !== 'pending') {
    return NextResponse.json({ 
      error: 'Invalid enrollment or already processed' 
    }, { status: 400 })
  }

  // Generate receipt PDF
  const receiptUrl = await generateReceipt(enrollment)

  // Update enrollment
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('enrollments')
    .update({
      payment_status: 'confirmed',
      confirmed_by: session.user.id,
      confirmed_at: new Date().toISOString(),
      receipt_url: receiptUrl
    })
    .eq('id', enrollmentId)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Send notification to student
  await supabaseAdmin.from('notifications').insert({
    user_id: enrollment.student_id,
    title: 'Payment Confirmed',
    message: `Your payment for ${enrollment.course.title} has been confirmed.`,
    notification_type: 'payment',
    reference_id: enrollmentId
  })

  return NextResponse.json({
    message: 'Payment confirmed',
    enrollment: updated,
    receipt_url: receiptUrl
  })
}
```

### 5. Real-time with Supabase

```javascript
// lib/realtime.js
import { supabase } from './supabase'

// Subscribe to new messages
export function subscribeToMessages(userId, callback) {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// Subscribe to notifications
export function subscribeToNotifications(userId, callback) {
  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
```

```javascript
// Usage in component
'use client'

import { useEffect, useState } from 'react'
import { subscribeToNotifications } from '@/lib/realtime'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(userId, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev])
      // Show toast notification
    })

    return unsubscribe
  }, [userId])

  return (
    <div>
      {/* Notification UI */}
    </div>
  )
}
```

### 6. Server Actions (Alternative to API Routes)

```javascript
// app/actions/assignments.js
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createAssignment(formData) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'instructor') {
    throw new Error('Unauthorized')
  }

  const assignment = {
    course_id: formData.get('courseId'),
    instructor_id: session.user.id,
    title: formData.get('title'),
    description: formData.get('description'),
    class_level: formData.get('classLevel'), // NEW
    due_date: formData.get('dueDate'),
    total_marks: parseInt(formData.get('totalMarks')),
  }

  const { data, error } = await supabaseAdmin
    .from('assignments')
    .insert(assignment)
    .select()
    .single()

  if (error) throw error

  // Notify students
  const { data: students } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('role', 'student')
    .eq('class_level', assignment.class_level)

  const notifications = students.map(s => ({
    user_id: s.id,
    title: 'New Assignment',
    message: `New assignment: ${assignment.title}`,
    notification_type: 'assignment',
    reference_id: data.id
  }))

  await supabaseAdmin.from('notifications').insert(notifications)

  revalidatePath('/instructor/assignments')
  return { success: true, data }
}

export async function submitAssignment(assignmentId, formData) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'student') {
    throw new Error('Unauthorized')
  }

  // Verify class level matches
  const { data: assignment } = await supabaseAdmin
    .from('assignments')
    .select('class_level')
    .eq('id', assignmentId)
    .single()

  if (assignment.class_level !== session.user.classLevel) {
    throw new Error('This assignment is not for your class level')
  }

  const submission = {
    assignment_id: assignmentId,
    student_id: session.user.id,
    submission_text: formData.get('submissionText'),
    attachment_url: formData.get('attachmentUrl'),
  }

  const { data, error } = await supabaseAdmin
    .from('assignment_submissions')
    .upsert(submission)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/student/assignments')
  return { success: true, data }
}
```

### 7. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx

NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://mytutorplus.ng

# Payment Gateways
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Google APIs
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
YOUTUBE_API_KEY=xxx
```

### 8. Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables are set in Vercel dashboard
```

---

## Payment Integration

### Paystack Integration (Primary for Nigeria)

```javascript
// lib/payment/paystack.js
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)

export async function initializePaystackPayment({ email, amount, reference }) {
  try {
    const response = await Paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      callback_url: `${process.env.APP_URL}/payment/verify`,
      metadata: {
        custom_fields: [
          {
            display_name: "Course Enrollment",
            variable_name: "enrollment_id",
            value: reference
          }
        ]
      }
    })

    return {
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function verifyPaystackPayment(reference) {
  try {
    const response = await Paystack.transaction.verify(reference)
    
    return {
      success: response.data.status === 'success',
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}
```

### Webhook Handler

```javascript
// app/api/webhooks/paystack/route.js (Next.js)
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data

    // Update enrollment status to pending (awaiting admin confirmation)
    const { error } = await supabaseAdmin
      .from('enrollments')
      .update({
        payment_status: 'pending', // Admin must confirm
        payment_reference: reference,
        amount_paid: amount / 100,
        payment_method: 'paystack'
      })
      .eq('payment_reference', reference)

    if (error) {
      console.error('Error updating enrollment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notify admin of new payment to confirm
    const { data: admins } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'admin')

    const notifications = admins.map(admin => ({
      user_id: admin.id,
      title: 'New Payment to Confirm',
      message: `Payment of ₦${amount / 100} received. Please confirm.`,
      notification_type: 'payment',
      reference_id: reference
    }))

    await supabaseAdmin.from('notifications').insert(notifications)
  }

  return NextResponse.json({ received: true })
}
```

---

## Real-time Features

### Laravel Echo + Pusher Setup

```javascript
// Frontend: lib/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
  authEndpoint: process.env.NEXT_PUBLIC_API_URL + '/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  }
})

// Usage
echo.private(`user.${userId}`)
  .listen('.new.message', (e) => {
    console.log('New message:', e.message)
  })
```

---

## File Storage

### AWS S3 Configuration

```javascript
// lib/storage/s3.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export async function uploadToS3(file, folder) {
  const fileName = `${folder}/${Date.now()}-${file.name}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read'
  })

  await s3Client.send(command)

  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
}
```

### Supabase Storage (Alternative)

```javascript
// lib/storage/supabase.js
import { supabase } from '../supabase'

export async function uploadToSupabase(file, bucket, folder) {
  const fileName = `${folder}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: publicURL } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicURL.publicUrl
}
```

---

## Security Considerations

### Row Level Security (Supabase)

```sql
-- Students can only see assignments for their class level
CREATE POLICY "Students see their class assignments"
ON assignments FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'student' 
  AND class_level = (
    SELECT class_level FROM users WHERE id = auth.uid()
  )
);

-- Instructors can create assignments
CREATE POLICY "Instructors create assignments"
ON assignments FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'instructor'
);

-- Students can only submit their own assignments
CREATE POLICY "Students submit own work"
ON assignment_submissions FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'student'
  AND student_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND class_level = (
      SELECT class_level FROM assignments WHERE id = assignment_id
    )
  )
);

-- Admins can access everything
CREATE POLICY "Admins access all"
ON enrollments FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

### Rate Limiting (Laravel)

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':60,1',
    ],
];

// routes/api.php
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
```

---

## Deployment Guide

### Laravel on DigitalOcean

**1. Server Setup (Ubuntu 22.04)**
```bash
# Create droplet ($6/month for MVP)
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install LEMP stack
apt install nginx mysql-server php8.2-fpm php8.2-mysql php8.2-mbstring \
  php8.2-xml php8.2-curl php8.2-zip php8.2-gd -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Setup MySQL
mysql_secure_installation
mysql -u root -p
CREATE DATABASE mytutorplus;
CREATE USER 'mytutorplus'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON mytutorplus.* TO 'mytutorplus'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**2. Deploy Laravel**
```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/mytutor-api.git
cd mytutor-api

# Install dependencies
composer install --optimize-autoloader --no-dev

# Setup environment
cp .env.example .env
nano .env # Update database and API keys

# Generate key and migrate
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chown -R www-data:www-data /var/www/mytutor-api
chmod -R 755 /var/www/mytutor-api/storage
```

**3. Nginx Configuration**
```nginx
# /etc/nginx/sites-available/mytutor-api
server {
    listen 80;
    server_name api.mytutorplus.ng;
    root /var/www/mytutor-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/mytutor-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.mytutorplus.ng
```

**4. Setup Supervisor (for queues)**
```bash
apt install supervisor -y
nano /etc/supervisor/conf.d/mytutor-worker.conf
```

```ini
[program:mytutor-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/mytutor-api/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/mytutor-api/storage/logs/worker.log
```

```bash
supervisorctl reread
supervisorctl update
supervisorctl start mytutor-worker:*
```

### Next.js on Vercel

**1. Connect GitHub Repository**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**2. Set Environment Variables in Vercel Dashboard**
- Go to Project Settings > Environment Variables
- Add all `.env.local` variables

**3. Setup Supabase**
- Create project at supabase.com
- Run migrations from SQL editor
- Copy API keys to Vercel

**4. Custom Domain**
- Add domain in Vercel dashboard
- Update DNS records:
  - A record: @ → 76.76.21.21
  - CNAME: www → cname.vercel-dns.com

---

## Cost Comparison (Monthly)

| Service | Laravel | Next.js |
|---------|---------|---------|
| Hosting | $6 (DigitalOcean) | $0 (Vercel free) |
| Database | $0 (on droplet) | $0 (Supabase free) |
| Storage (50GB) | $5 (DigitalOcean Spaces) | $0 (Supabase free) |
| SSL | Free (Let's Encrypt) | Free (Vercel) |
| Real-time | $9 (Pusher) | $0 (Supabase) |
| **Total** | **$20/month** | **$0-5/month** |

---

## Recommendation Summary

### Choose Laravel if:
- You have PHP developers on team
- Need 100% custom business logic
- Planning enterprise-scale (10k+ users)
- Want full control over infrastructure

### Choose Next.js + Supabase if:
- You want fastest time-to-market
- Limited budget for MVP
- Need real-time features
- Want automatic scaling
- Prefer React/TypeScript ecosystem

---

## Next Steps

1. **Choose your backend approach** (Laravel vs Next.js)
2. **Set up development environment**
3. **Implement authentication first**
4. **Build core features incrementally**:
   - User management
   - Course creation
   - Enrollment & payments
   - Assignments with class level filtering
   - Live classes
   - Messaging
5. **Test payment webhooks thoroughly**
6. **Deploy to staging environment**
7. **User acceptance testing**
8. **Production deployment**

---

## Support & Resources

### Laravel Resources
- Documentation: https://laravel.com/docs
- Nigerian Laravel community: https://laravelng.com
- Pusher docs: https://pusher.com/docs

### Next.js Resources
- Documentation: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- NextAuth.js: https://next-auth.js.org

### Payment Gateways
- Paystack: https://paystack.com/docs
- Flutterwave: https://developer.flutterwave.com
- Stripe: https://stripe.com/docs

---

**Need help implementing? Let me know which option you choose and I can help you get started!** 🚀
