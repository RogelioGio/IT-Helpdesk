/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.2.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ictdhelpdesk
-- ------------------------------------------------------
-- Server version	12.2.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `accountroles`
--

DROP TABLE IF EXISTS `accountroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountroles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountroles`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `accountroles` WRITE;
/*!40000 ALTER TABLE `accountroles` DISABLE KEYS */;
INSERT INTO `accountroles` VALUES
(1,'System Admin','Has full system control including user management, role configuration, system settings, and database-level access.','2026-03-02 01:19:08','2026-03-02 01:19:08',NULL),
(2,'Administrator','Manages the system configuration and has the highest level of access.','2026-03-02 01:19:08','2026-03-02 01:19:08',NULL),
(3,'Manager','Person that manages the ticket given to the system and can assign it to an officer.','2026-03-02 01:19:08','2026-03-02 01:19:08',NULL),
(4,'Officer','Respondent for the assigned ticket and can update the status of the ticket.','2026-03-02 01:19:08','2026-03-02 01:19:08',NULL),
(5,'User','End users that mainly create tickets and ask for assistance.','2026-03-02 01:19:08','2026-03-02 01:19:08',NULL);
/*!40000 ALTER TABLE `accountroles` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activityCode` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES
(1,'ACT-001','Repair of Hardware and Software','Troubleshooting and fixing hardware devices and software-related issues to restore normal functionality.','2026-02-23 08:10:18','2026-02-23 08:10:18',NULL),
(2,'ACT-002','Installation of Software','Installation, configuration, and setup of approved software applications on user devices or servers.','2026-02-23 08:10:18','2026-02-23 08:10:18',NULL),
(3,'ACT-003','Information Systems Support','Technical support and maintenance for internal information systems, applications, and related services.','2026-02-23 08:10:18','2026-02-23 08:10:18',NULL),
(4,'ACT-004','Others','Other technical concerns or service requests not covered by the defined activity categories.','2026-02-23 08:10:18','2026-02-23 08:10:18',NULL);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `activityspecification`
--

DROP TABLE IF EXISTS `activityspecification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activityspecification` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activitySpecificationCode` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `activity_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activityspecification_activity_id_foreign` (`activity_id`),
  CONSTRAINT `activityspecification_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activityspecification`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `activityspecification` WRITE;
/*!40000 ALTER TABLE `activityspecification` DISABLE KEYS */;
INSERT INTO `activityspecification` VALUES
(1,'RHS-DESK-01','Desktop Problem','Issues related to desktop computers including hardware failure, system errors, or performance problems.',1,'2026-03-12 03:10:24','2026-03-12 03:10:24',NULL),
(2,'RHS-PRNT-02','Printer Problem','Printer malfunction, connectivity issues, driver errors, or printing failures.',1,'2026-03-12 03:10:24','2026-03-12 03:10:24',NULL),
(3,'RHS-OS-03','Corrupted Operating System','Operating system failure, boot errors, corrupted system files, or system crashes requiring repair or reinstallation.',1,'2026-03-12 03:10:24','2026-03-12 03:10:24',NULL),
(4,'RHS-LAP-04','Laptop Problem','Hardware or software issues affecting laptop devices including battery, display, or system performance.',1,'2026-03-12 03:10:24','2026-03-12 03:10:24',NULL),
(5,'RHS-SCAN-05','Scanner Problem','Scanner device malfunction, driver issues, or connectivity problems.',1,'2026-03-12 03:10:24','2026-03-12 03:10:24',NULL),
(6,'INS-OS-01','Reformat/Operating System Upgrade','Reformatting a device or upgrading the operating system to improve performance, fix system errors, or enhance security and compatibility.',2,'2026-03-12 03:10:53','2026-03-12 03:10:53',NULL),
(7,'INS-MSO-02','MS Office','Installation, configuration, or reinstallation of Microsoft Office applications including Word, Excel, PowerPoint, Outlook, and related tools.',2,'2026-03-12 03:10:53','2026-03-12 03:10:53',NULL),
(8,'INS-SCD-03','Scanner Driver','Installation or updating of scanner drivers to ensure proper device detection, functionality, and compatibility with the operating system.',2,'2026-03-12 03:10:53','2026-03-12 03:10:53',NULL),
(9,'INS-AV-04','Antivirus','Installation and configuration of authorized antivirus or endpoint protection software to safeguard systems against malware and cyber threats.',2,'2026-03-12 03:10:53','2026-03-12 03:10:53',NULL),
(10,'INS-PRD-05','Printer Driver','Installation or reinstallation of printer drivers to enable printing services and resolve driver-related issues.',2,'2026-03-12 03:10:53','2026-03-12 03:10:53',NULL),
(11,'ISS-DMS-01','DMS','Support, troubleshooting, and maintenance of the Document Management System including access issues, document retrieval errors, and system configuration concerns.',3,'2026-03-12 03:11:11','2026-03-12 03:11:11',NULL),
(12,'ISS-ENG-02','eNGAS and eBudget','Technical assistance and issue resolution related to eNGAS and eBudget systems including login errors, report generation problems, and data processing concerns.',3,'2026-03-12 03:11:11','2026-03-12 03:11:11',NULL),
(13,'ISS-SD-03','IT Service Desk','Support for IT Service Desk system issues including ticket creation errors, status updates, user access management, and system performance concerns.',3,'2026-03-12 03:11:11','2026-03-12 03:11:11',NULL),
(14,'ISS-ETS-04','Expediente Tracking System','Support and troubleshooting for the Expediente Tracking System including tracking errors, data inconsistencies, and access-related issues.',3,'2026-03-12 03:11:11','2026-03-12 03:11:11',NULL),
(15,'OTH-HDI-01','New hardware delivery inspection','Inspection and verification of newly delivered hardware equipment to ensure completeness, proper specifications, and operational condition.',4,'2026-03-12 03:11:23','2026-03-12 03:11:23',NULL),
(16,'OTH-GMR-02','GovMail Reset password','Password reset assistance and account recovery support for official GovMail email accounts.',4,'2026-03-12 03:11:23','2026-03-12 03:11:23',NULL),
(17,'OTH-DEP-03','Deployment of IT equipment/installation','Deployment, setup, and installation of IT equipment including desktops, laptops, printers, and related peripherals.',4,'2026-03-12 03:11:23','2026-03-12 03:11:23',NULL),
(18,'OTH-INT-04','Internet access issue','Troubleshooting and resolution of internet connectivity problems including network access, slow connection, and configuration issues.',4,'2026-03-12 03:11:23','2026-03-12 03:11:23',NULL),
(19,'OTH-ITP-05','IT support on presentation/meetings','Technical assistance during presentations, meetings, or events including equipment setup, projector configuration, and connectivity support.',4,'2026-03-12 03:11:23','2026-03-12 03:11:23',NULL);
/*!40000 ALTER TABLE `activityspecification` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `audits`
--

DROP TABLE IF EXISTS `audits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audits` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event` varchar(255) NOT NULL,
  `auditable_type` varchar(255) NOT NULL,
  `auditable_id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audits_auditable_type_auditable_id_index` (`auditable_type`,`auditable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audits`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `audits` WRITE;
/*!40000 ALTER TABLE `audits` DISABLE KEYS */;
/*!40000 ALTER TABLE `audits` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cancel_reasons`
--

DROP TABLE IF EXISTS `cancel_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancel_reasons` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reason` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancel_reasons`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cancel_reasons` WRITE;
/*!40000 ALTER TABLE `cancel_reasons` DISABLE KEYS */;
/*!40000 ALTER TABLE `cancel_reasons` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `cancellations`
--

DROP TABLE IF EXISTS `cancellations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancellations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `cancelled_by` bigint(20) unsigned DEFAULT NULL,
  `cancel_reason_id` bigint(20) unsigned DEFAULT NULL,
  `custom_reason` text DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cancellations_ticket_id_unique` (`ticket_id`),
  KEY `cancellations_cancelled_by_foreign` (`cancelled_by`),
  KEY `cancellations_cancel_reason_id_foreign` (`cancel_reason_id`),
  CONSTRAINT `cancellations_cancel_reason_id_foreign` FOREIGN KEY (`cancel_reason_id`) REFERENCES `cancel_reasons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cancellations_cancelled_by_foreign` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cancellations_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancellations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `cancellations` WRITE;
/*!40000 ALTER TABLE `cancellations` DISABLE KEYS */;
/*!40000 ALTER TABLE `cancellations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned DEFAULT NULL,
  `requester_id` bigint(20) unsigned DEFAULT NULL,
  `suggestion` varchar(255) DEFAULT NULL,
  `commendation` varchar(255) DEFAULT NULL,
  `complaint` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_ticket_id_foreign` (`ticket_id`),
  KEY `feedback_requester_id_foreign` (`requester_id`),
  CONSTRAINT `feedback_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `feedback_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `feedbackdimension`
--

DROP TABLE IF EXISTS `feedbackdimension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbackdimension` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dimension` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbackdimension`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `feedbackdimension` WRITE;
/*!40000 ALTER TABLE `feedbackdimension` DISABLE KEYS */;
INSERT INTO `feedbackdimension` VALUES
(1,'Responsiveness','Ang mga kawani ay handang tumulong, maasikaso, at maagap sa pagsagot ng mga tanong','2026-03-10 05:53:21','2026-03-10 05:53:21'),
(2,'Reliability','Ginawa nang tama ang serbisyo','2026-03-10 05:53:21','2026-03-10 05:53:21'),
(3,'Communication','Magalang at mahusay makipag-usap ang mga kawani','2026-03-10 05:53:21','2026-03-10 05:53:21'),
(4,'Integrity','Matapat, mapagkakatiwalaan at walang pinapanigan ang mga kawani','2026-03-10 05:53:21','2026-03-10 05:53:21'),
(5,'Assurance','Sapat ang kaalaman sa trabaho','2026-03-10 05:53:21','2026-03-10 05:53:21'),
(6,'Outcome','Naibigay ang serbisyong kailangan','2026-03-10 05:53:21','2026-03-10 05:53:21');
/*!40000 ALTER TABLE `feedbackdimension` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `feedbackresponses`
--

DROP TABLE IF EXISTS `feedbackresponses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbackresponses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `feedback_id` bigint(20) unsigned NOT NULL,
  `dimension_id` bigint(20) unsigned NOT NULL,
  `dimension_value` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedbackresponses_feedback_id_foreign` (`feedback_id`),
  CONSTRAINT `feedbackresponses_feedback_id_foreign` FOREIGN KEY (`feedback_id`) REFERENCES `feedback` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbackresponses`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `feedbackresponses` WRITE;
/*!40000 ALTER TABLE `feedbackresponses` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedbackresponses` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_02_15_093217_create__activity_table',2),
(5,'2026_02_15_093722_createaccount_roles_table',3),
(6,'2026_02_15_093854_createoffice_department_division_table',4),
(7,'2026_02_15_101106_createactivity_specification_table',5),
(8,'2026_02_15_101610_createticketstatus_table',6),
(9,'2026_02_15_101749_createticketrelevance_table',7),
(10,'2026_02_15_103048_update_user_table',8),
(11,'2026_02_15_121526_createticket_table',9),
(12,'2026_02_17_013947_create_personal_access_tokens_table',10),
(13,'2026_02_23_072953_add_soft_deletes_to_all_user_management_tables',11),
(14,'2026_02_24_004635_add_middle_name_to_users_table',11),
(15,'2026_02_27_025134_make_activity_id_nullable_in_tickets_table',12),
(16,'2026_02_27_033843_make_responder_id_nullable_in_tickets_table',13),
(17,'2026_02_27_044456_make_findings_and_resolution_nullable_in_tickets_table',13),
(18,'2026_02_28_151447_create_ticket_user_table',13),
(19,'2026_03_03_011910_add_soft_deletes_to_activity_and_spec_tables',14),
(20,'2026_03_03_033555_add_description_to_ticket_table',14),
(21,'2026_03_03_060954_add_soft_deletes_to_all_tables',14),
(22,'2026_03_03_235235_add_date_responded_to_ticket_table',14),
(23,'2026_03_05_074859_create_audits_table',14),
(24,'2026_03_06_022024_add_fulltext_indexes_to_users_and_tickets',14),
(25,'2026_03_06_075616_change_auditable_id_to_string_in_audits_table',14),
(26,'2026_03_09_000959_create_recent_tickets_table',14),
(27,'2026_03_09_020302_add_cancelled_status_to_ticket_status_table',14),
(28,'2026_03_10_052003_add_feedback_table',14),
(29,'2026_03_10_053222_add_feedbackdimension_table',15),
(30,'2026_03_10_053346_add_feedback_pivot_table',16),
(31,'2026_03_10_053630_create_cancellation_system_tables',16),
(32,'2026_03_11_014324_create_request_assignment_table',16),
(33,'2026_03_11_032303_create_ticket_status_table',16),
(34,'2026_03_14_170042_add_fulltext_index_to_users_table',16),
(35,'2026_03_16_212608_create_notifications_table',16);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) unsigned NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `office_department_division`
--

DROP TABLE IF EXISTS `office_department_division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_department_division` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `officeCode` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_department_division`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `office_department_division` WRITE;
/*!40000 ALTER TABLE `office_department_division` DISABLE KEYS */;
INSERT INTO `office_department_division` VALUES
(1,'F-ACCD','Accounting Division','Accounting Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(2,'ADMINS','Administrative Service','Administrative Service','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(3,'FA-BKS','Bookkeeping Section','Bookkeeping Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(4,'F-BUDD','Budget Division','Budget Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(5,'FB-BUS','Budget Section','Budget Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(6,'LO-CAD','Cadastral Decree Section','Cadastral Decree Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(7,'AG-CSS','Cashiering Services Section','Cashiering Services Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(8,'AG-CRS','Central Records Section','Central Records Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(9,'FA-DIS','Disbursement Section','Disbursement Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(10,'L-DOCD','Docket Division','Docket Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(11,'LD-DVS','Docket Vault Section','Docket Vault Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(12,'LD-DIS','Documentation & Index Section','Documentation & Index Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(13,'FINANS','Financial Service','Financial Service','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(14,'AS-GSD','General Services Division','General Services Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(15,'A-HRDD','Human Resource Development Division','Human Resource Development Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(16,'OAICTD','Information and Communication Technology Division','Information and Communication Technology Division','2026-02-23 07:07:20','2026-02-24 22:18:19',NULL),
(17,'LO-LPS','Land Projection Section','Land Projection Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(18,'L-LRCD','Land Registration Cases Division','Land Registration Cases Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(19,'L-LRMD','Land Registration Monitoring Division','Land Registration Monitoring Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(20,'LAROSE','Land Registration Operation Service','Land Registration Operation Service','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(21,'L-LEGD','Legal Division','Legal Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(22,'LEGALS','Legal Service','Legal Service','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(23,'LO-PES','LPS Plan Examination Section','LPS Plan Examination Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(24,'LRAQMS','LRA ISO-QMS Core Team (Special Group for ISO QMS)','LRA ISO-QMS Core Team (Special Group for ISO QMS)','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(25,'OADMIN','Office of the Administrator','Office of the Administrator','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(26,'ODAADM','Office of the Deputy Administrator for Administration','Office of the Deputy Administrator for Administration','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(27,'ODAOPE','Office of the Deputy Administrator for Operation','Office of the Deputy Administrator for Operation','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(28,'LO-ODS','Ordinary Decree Section','Ordinary Decree Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(29,'LS-ORD','Original Registration Division','Original Registration Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(30,'ODPSPB','Personnel Selection and Promotion Board','Personnel Selection and Promotion Board','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(31,'OAPAMD','Planning and Management Division','Planning and Management Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(32,'AG-PSS','Property and Supply Section','Property and Supply Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(33,'AGPRIS','Public Relation and Information Section','Public Relation and Information Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(34,'LD-PUB','Publication of Notices Section','Publication of Notices Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(35,'L-RECD','Reconstitution Division','Reconstitution Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(36,'LS-RVS','Records Verification Section','Records Verification Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(37,'FA-REV','Revenue Section','Revenue Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(38,'LS-PES','SCD Plan and Examination Section','SCD Plan and Examination Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(39,'LS-SVS','SCD Vault I & II Section','SCD Vault I & II Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(40,'FB-STA','Statistical Section','Statistical Section','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(41,'LS-SCD','Subdivision and Consolidation Division','Subdivision and Consolidation Division','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL),
(42,'OADM1N','Office of the Admin Outgoing (for Office of the Admin use only)','Office of the Admin Outgoing (for Office of the Admin use only)','2026-02-23 07:07:20','2026-02-23 07:07:20',NULL);
/*!40000 ALTER TABLE `office_department_division` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `recent_tickets`
--

DROP TABLE IF EXISTS `recent_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recent_tickets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `recent_tickets_user_id_foreign` (`user_id`),
  KEY `recent_tickets_ticket_id_foreign` (`ticket_id`),
  CONSTRAINT `recent_tickets_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recent_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recent_tickets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `recent_tickets` WRITE;
/*!40000 ALTER TABLE `recent_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `recent_tickets` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `requestassignment`
--

DROP TABLE IF EXISTS `requestassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `requestassignment` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requestassignment_ticket_id_foreign` (`ticket_id`),
  KEY `requestassignment_user_id_foreign` (`user_id`),
  CONSTRAINT `requestassignment_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE,
  CONSTRAINT `requestassignment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requestassignment`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `requestassignment` WRITE;
/*!40000 ALTER TABLE `requestassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `requestassignment` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES
('38jMa1lJIzLtBHtnjeXNQX7ytORoOM1QsXQn7vf8',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidlVHYVJYeWRXd0JTV0ptWDBXZnQyZjhZam41eG5selloTDM3SlQwZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772603805),
('3pHblHukdkw9WCWuKr6unSdY8egjzqi1ehsFFS3n',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFd3T0dFZkFocVRQdlBhYWh5WnB4TjhTUHFaVnVIRWdRbVJxUUNlTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdXNlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772672588),
('3RPK5745RnQXGIvKHrjeSYU2ypRzyrapmGoiRkV6',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXRKdkJ0Q3k3OXh4S3B2MTVpOGxmTTBWZVh5aWJzSFU3amFRZHc0TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdXNlcnMiO3M6NToicm91dGUiO3M6MTE6InVzZXJzLmluZGV4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772603779),
('c52aTY5dYFtNS5xAye6bTCygz5x89TsPCMtYyNwf',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmRybnpDRENQeGdjZ2tTZWRVa2x1cEEyTlFaU09NeFo4Q3ZSRkduVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGlja2V0cyI7czo1OiJyb3V0ZSI7czoxMzoidGlja2V0cy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1772672587),
('D4h0nwkoIYBUTCnZIU3wbB0A1AYjKmpyQtmdGud2',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiREtJRldjdThrb2FKcFZsQXdwc3pMZXNVUnpkdGUxRk03UnE5UDRRayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWN0aXZpdGllc1NwZWNpZmljYXRpb25zIjtzOjU6InJvdXRlIjtzOjMwOiJhY3Rpdml0aWVzU3BlY2lmaWNhdGlvbnMuaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=',1772678019),
('EBAzwETru14ksWus61ayfBFl7p7RBAgntGXGmU90',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicG1CUGlHdmRPMzVPNzJXeU9GMWdPVExRZWV1eGkzVzBOUXVZZVN5MSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdXNlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772700228),
('GxBWgXfe609q25IUJsaHeokQGqRpT95cIAQ5w1jo',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0poRGkwdjZiTW93RFFySWYzaGxZTTlUNGVuMlpxTGkzWFRFMEZlMiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGlja2V0cyI7czo1OiJyb3V0ZSI7czoxMzoidGlja2V0cy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1772700228),
('MFVaAnsFBQ9BV8bE83N8AE8hx6dVTCrUwaUQFiQr',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVklPRlB3eVB0VUxCSVNoN2ZLanN1aHgzTXd3enJESE5PeGpodHBtbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772678010),
('OJP3qpHb5qrphqP5wTtt5VSqm6C2KLG5jgaLkkM5',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlJyUWxDSjVEN1YyZ1RsYnFZMVlpZE9ST1NubGxub3R3WG5pV21IcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772672588),
('SxeMiveS32gjnKRXz3ntGQXTLxiV2MwyxnTtTYgR',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNElSQUNwNklZdXFyMklkT1VzOEhCNzF3ZEpYRHBiWmpXMEpHN2x2UyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWN0aXZpdGllc1NwZWNpZmljYXRpb25zIjtzOjU6InJvdXRlIjtzOjMwOiJhY3Rpdml0aWVzU3BlY2lmaWNhdGlvbnMuaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=',1772605576),
('tzWGGcwhVQLMFkVCW4lk2xOtI8bta14Tb1SbsLjW',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHlrRkZNVGN6VkJJczlpV3Nsb2cyZkpMMVpYeUJ3MTRGb2NXZjJsOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772603805),
('UNCGvcC0oWW5HGkYVZnwtHzZDXj3pUBQwshH8M17',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWl5dmh5Wm5ZT2ZzSEF3TVRpeU1wTnl6SlQ2b0YwSlI0Y2tJMXRoWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772678010),
('WDG6CYGebvu1ZpnJf3zaZ1djr0zzF5aebAtDgiiR',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVVDMUFhWFAzWm0yQ3N3NmZSRGtzZTQ4Yll3eU1nU1RGQVJEdmtyVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zYW5jdHVtL2NzcmYtY29va2llIjtzOjU6InJvdXRlIjtzOjE5OiJzYW5jdHVtLmNzcmYtY29va2llIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1772672588),
('XeoSkPAUEKm7KbsAiPO4cHtkXUBZXlOBhcuLMw8g',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWU1SzlROTdveEo4UDk4NGRsNWNqVnRTRzNYYkIyYW9wMFR2UXZNeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGlja2V0cyI7czo1OiJyb3V0ZSI7czoxMzoidGlja2V0cy5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1772672588);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticketId` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `activity_id` bigint(20) unsigned NOT NULL,
  `activitySpecification_id` bigint(20) unsigned NOT NULL,
  `assetSerialNumber` varchar(255) NOT NULL,
  `status_id` bigint(20) unsigned NOT NULL,
  `priority_id` bigint(20) unsigned DEFAULT NULL,
  `responder_id` bigint(20) unsigned DEFAULT NULL,
  `requester_id` bigint(20) unsigned NOT NULL,
  `assignementDate` timestamp NULL DEFAULT NULL,
  `respondedDate` timestamp NULL DEFAULT NULL,
  `findings` varchar(255) DEFAULT NULL,
  `resolution` varchar(255) DEFAULT NULL,
  `dateClosed` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_activity_id_foreign` (`activity_id`),
  KEY `ticket_activityspecification_id_foreign` (`activitySpecification_id`),
  KEY `ticket_status_id_foreign` (`status_id`),
  KEY `ticket_priority_id_foreign` (`priority_id`),
  KEY `ticket_responder_id_foreign` (`responder_id`),
  KEY `ticket_requester_id_foreign` (`requester_id`),
  FULLTEXT KEY `ticket_description_findings_assetserialnumber_fulltext` (`description`,`findings`,`assetSerialNumber`),
  CONSTRAINT `ticket_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_activityspecification_id_foreign` FOREIGN KEY (`activitySpecification_id`) REFERENCES `activityspecification` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_priority_id_foreign` FOREIGN KEY (`priority_id`) REFERENCES `ticketrelevance` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ticket_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticket_responder_id_foreign` FOREIGN KEY (`responder_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ticket_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `ticketstatus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ticketassignment`
--

DROP TABLE IF EXISTS `ticketassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketassignment` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketassignment_ticket_id_foreign` (`ticket_id`),
  KEY `ticketassignment_user_id_foreign` (`user_id`),
  CONSTRAINT `ticketassignment_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ticketassignment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketassignment`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ticketassignment` WRITE;
/*!40000 ALTER TABLE `ticketassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticketassignment` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ticketrelevance`
--

DROP TABLE IF EXISTS `ticketrelevance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketrelevance` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `relevanceCode` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketrelevance`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ticketrelevance` WRITE;
/*!40000 ALTER TABLE `ticketrelevance` DISABLE KEYS */;
INSERT INTO `ticketrelevance` VALUES
(1,'P1','Critical','The entire organization or a large department is \"down.\" There is no workaround.','2026-02-23 07:40:20','2026-02-23 07:40:20',NULL),
(2,'P2','High ','A large group of people is hampered, or a critical business process (like payroll) is failing, though other systems are fine.','2026-02-23 07:40:20','2026-02-23 07:40:20',NULL),
(3,'P3','Medium  ','Work is still possible, but it???s inconvenient or requires a manual workaround.','2026-02-23 07:40:20','2026-02-23 07:40:20',NULL),
(4,'P4','Low   ','Little to no impact on productivity. Often includes routine requests.','2026-02-23 07:40:20','2026-02-23 07:40:20',NULL);
/*!40000 ALTER TABLE `ticketrelevance` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ticketstatus`
--

DROP TABLE IF EXISTS `ticketstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketstatus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketstatus`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ticketstatus` WRITE;
/*!40000 ALTER TABLE `ticketstatus` DISABLE KEYS */;
INSERT INTO `ticketstatus` VALUES
(1,'Open','The ticket has been created and successfully logged in the system. It is awaiting review and assignment to the appropriate personnel or team.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL),
(2,'Assigned','The ticket has been assigned to a specific support staff member or team for handling. Investigation or resolution is pending or currently in progress.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL),
(3,'Responded','The assigned support personnel has provided an initial response, update, or requested additional information from the requester. The ticket is actively being addressed.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL),
(4,'Resolved','The issue was resolved.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL),
(5,'Closed','The reported issue has been resolved or completed. No further action is required, and the ticket is formally closed.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL),
(6,'Cancelled','The issue was cancelled.','2026-03-05 01:46:21','2026-03-05 01:46:21',NULL);
/*!40000 ALTER TABLE `ticketstatus` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tickettimeline`
--

DROP TABLE IF EXISTS `tickettimeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickettimeline` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) unsigned NOT NULL,
  `status_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tickettimeline_ticket_id_foreign` (`ticket_id`),
  KEY `tickettimeline_status_id_foreign` (`status_id`),
  KEY `tickettimeline_user_id_foreign` (`user_id`),
  CONSTRAINT `tickettimeline_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `ticketstatus` (`id`),
  CONSTRAINT `tickettimeline_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tickettimeline_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickettimeline`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tickettimeline` WRITE;
/*!40000 ALTER TABLE `tickettimeline` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickettimeline` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `employeeID` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `office_department_division_id` bigint(20) unsigned NOT NULL,
  `account_role_id` bigint(20) unsigned NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `users_office_department_division_id_foreign` (`office_department_division_id`),
  KEY `users_account_role_id_foreign` (`account_role_id`),
  FULLTEXT KEY `users_firstname_lastname_email_username_fulltext` (`firstName`,`lastName`,`email`,`username`),
  FULLTEXT KEY `user_search_index` (`employeeID`,`firstName`,`lastName`,`username`,`designation`,`email`),
  CONSTRAINT `users_account_role_id_foreign` FOREIGN KEY (`account_role_id`) REFERENCES `accountroles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_office_department_division_id_foreign` FOREIGN KEY (`office_department_division_id`) REFERENCES `office_department_division` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'0000000','System',NULL,'Admin','example1@gmail.com','$2y$12$cww2PI/xV0qG8aq0GVHzvuZNgpbuW0Xe4XysO4Mbr.S9Th7WXHKDW','systemadmin','ADMIN','2026-03-01 22:41:36','2026-03-01 22:41:36',16,1,NULL),
(2,'0000001','Admin',NULL,'Admin','example2@gmail.com','$2y$12$wdVZTHIRLwjV9hB94AB4QeyJ0y9Yy7fZ6GyhKa4dynR4O52dNhx0i','admin','Administrator','2026-03-01 23:06:48','2026-03-01 23:06:48',16,3,NULL),
(3,'0000002','Manager','User','User','example3@gmail.com','$2y$12$WvEZunHKvmcAaBejCwSie.AraKg8FqI8qESVmVc65794RPKlhBA5S','manager','Manager','2026-03-01 23:12:54','2026-03-01 23:13:57',16,4,NULL),
(4,'0000003','Officer',NULL,'One','example4@gmail.com','$2y$12$5s8w56upG85LPRczIg4cfen40UD7x7tyfU0weR5CeHUvO6EfrZCHi','officer.one','Officer 1','2026-03-01 23:20:42','2026-03-01 23:20:42',16,5,NULL),
(5,'0000004','Officer',NULL,'Two','example5@gmail.com','$2y$12$P/ji5XUtlRBLZiVt5csXmeZOJwZaqmmXl2yemajirLBP9FQ7AjBHu','officer.two','Officer 2','2026-03-02 00:07:31','2026-03-02 00:07:31',16,5,NULL),
(6,'0000005','Officer',NULL,'Three','example6@gmail.com','$2y$12$52K2Ryw0ZiRG0XxUVwXmB..qTyrbd4yo1YSfeJ4InxVA6TWvBL8gK','officer.three','Officer 3','2026-03-02 00:09:36','2026-03-02 00:09:36',16,5,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-03-19 16:24:17
