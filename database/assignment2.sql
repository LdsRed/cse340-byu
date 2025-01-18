
-- 1) INSERT A NEW VALUE TO THE ACCOUNT TABLE
INSERT INTO public.account (account_firstname,
							account_lastnmae,
							account_email,
							account_password,
							account_type)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Client');


-- 2) Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = ;


-- 3) Delete the Tony Stark record from the database.

DELETE FROM public.account
WHERE account_id = 1;

-- 4) Modify the description of the record associated with inv_id of 10 to say "a huge interior"
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;


-- 5) Use Inner join to select two tables
SELECT 
	inventory.inv_make,
	inventory.inv_model,
	classification.classification_name
FROM 
	public.inventory
INNER JOIN
	public.classification
ON
	inventory.classification_id = classification.classification_id
WHERE
	classification.classification_name = 'Sport';

-- 6) Modify the image and thumbnail for the record associated with inv_id of 10 to say "/images/vehicles"
UPDATE public.inventory
SET 
inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), 
inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')
WHERE inv_id = 10;