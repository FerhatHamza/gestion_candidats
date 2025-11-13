DROP TABLE IF EXISTS candidats; -- delete if EXISTS

CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  sex TEXT CHECK(sex IN ('man', 'woman')) NOT NULL,
  birthDate DATE NOT NULL,
  placeOfBirth VARCHAR(150) NOT NULL,
  addressLine TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  familySituation TEXT CHECK(familySituation IN ('single', 'married', 'divorced', 'widowed')) NOT NULL,
  numberOfChildren INT DEFAULT 0
);

-- firstName,lastName,sex,birthDate,placeOfBirth,addressLine,phone,email,familySituation,numberOfChildren

CREATE TABLE nationalService (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  situation TEXT CHECK(situation IN ('Exempté', 'Dégagé', 'Sursis')) NOT NULL,
  docNumber VARCHAR(100) NOT NULL,
  docDate DATE NOT NULL,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- candidate_id, situation, docNumber, docDate

CREATE TABLE documentSubmitted (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  demande_ecrite BOOLEAN DEFAULT FALSE,
  copyOfID BOOLEAN DEFAULT FALSE,
  diplome BOOLEAN DEFAULT FALSE,
  releve_notes BOOLEAN DEFAULT FALSE,
  certificat_service BOOLEAN DEFAULT FALSE,
  photos BOOLEAN DEFAULT FALSE,
  enveloppes BOOLEAN DEFAULT FALSE,
  attestations_travail BOOLEAN DEFAULT FALSE,
  autres_pieces TEXT,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- candidate_id, demande_ecrite, copyOfID, diplome, releve_notes, certificat_service, photos, enveloppes, attestations_travail, autres_pieces

CREATE TABLE agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role TEXT CHECK(role IN ('admin', 'agent')) DEFAULT 'agent'
);

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_id INT,
  candidate_id INT,
  action TEXT CHECK(action IN ('add', 'modify', 'delete')) NOT NULL,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- ENUM('Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)')