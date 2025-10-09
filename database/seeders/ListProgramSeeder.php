<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\ListProgram;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ListProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tbl_list_programs = array(
            array('id' => '1','program_title' => 'PC Operation','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '2','program_title' => 'PC Operation using Windows Operating System','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '3','program_title' => 'Computer and Internet Literacy Course using Linux Apps.','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '4','program_title' => 'PC Operation NC I','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '5','program_title' => 'Electrical Product Assembly Servicing (EPAS)','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '6','program_title' => 'PV Systems Installation NC II','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '7','program_title' => 'Contact Tracing Level II','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '8','program_title' => 'Electrical Installation Maintenance NC II','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '9','program_title' => 'Computer System Servicing NC II','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '10','program_title' => 'Automotive NC I','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '11','program_title' => 'Multimedia, Audio Editing','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '12','program_title' => 'Module Making using Android Office','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '13','program_title' => 'Webinar on Virtual Classroom,Mobile Video Learning Materials and OBS App.','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '14','program_title' => 'Webinar on Computer System Servicing leading to NC2','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '15','program_title' => 'Cyber Defense for Data Security Webinar','deleted_at' => NULL,'created_at' => '2023-03-01 17:57:27','updated_at' => NULL),
            array('id' => '16','program_title' => 'Industrial Mastering Graphic Design Using Adobe Photoshop','deleted_at' => NULL,'created_at' => '2024-08-12 15:28:04','updated_at' => '2024-08-12 15:28:04'),
            array('id' => '17','program_title' => 'Mastering of Social Media','deleted_at' => NULL,'created_at' => '2024-08-13 11:45:35','updated_at' => '2024-08-13 11:46:50'),
            array('id' => '18','program_title' => 'Basic Basic Computer Operation Using Windows Application','deleted_at' => NULL,'created_at' => '2024-08-13 13:02:42','updated_at' => '2024-08-13 13:02:42'),
            array('id' => '19','program_title' => 'Basic HTML and CSS for Web Design and Java Script','deleted_at' => NULL,'created_at' => '2024-08-16 13:22:25','updated_at' => '2024-08-16 13:22:25'),
            array('id' => '20','program_title' => 'Cyber Security Level 3','deleted_at' => NULL,'created_at' => '2024-08-16 13:22:25','updated_at' => '2024-08-16 13:22:25'),
            array('id' => '21','program_title' => 'Introduction to Web Development Using PHP + MYSQL for Beginner','deleted_at' => NULL,'created_at' => '2024-08-16 13:51:33','updated_at' => '2024-08-16 13:51:33'),
            array('id' => '22','program_title' => 'Introduction to Laravel Frameworks','deleted_at' => NULL,'created_at' => '2024-08-16 14:17:19','updated_at' => '2024-08-16 14:17:19'),
            array('id' => '23','program_title' => 'Creating Virtual Studio Using OBS, Filmora and Corel','deleted_at' => NULL,'created_at' => '2024-08-16 14:36:41','updated_at' => '2024-08-16 15:36:07'),
            array('id' => '24','program_title' => 'Entrepreneurship','deleted_at' => NULL,'created_at' => '2024-08-16 16:31:24','updated_at' => '2024-08-16 16:31:24'),
            array('id' => '25','program_title' => 'Visual Graphics','deleted_at' => NULL,'created_at' => '2024-08-19 13:39:26','updated_at' => '2024-08-19 13:39:26')
          );
            DB::table('tbl_list_programs')->insert($tbl_list_programs);


    }
}
    
