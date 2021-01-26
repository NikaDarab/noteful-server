BEGIN

INSERT INTO note (name,content,folderid) 
VALUES 
('note1','this is note1',1),
('folder2','this is folder2',2),
('folder2','this is folder3',3)

COMMIT;