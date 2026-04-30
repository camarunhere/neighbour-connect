CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('announcement', 'lost_found', 'event') NOT NULL,
  author_name VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
  status ENUM('lost', 'found', 'claimed') DEFAULT NULL,
  event_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
