-- INSERT A NEW VALUE TO THE ACCOUNT TABLE
INSERT INTO public.account (account_firstname,
							account_lastnmae,
							account_email,
							account_password,
							account_type)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Client');


-- ALTER OR MODIFY A VALUE IN THE ACCOUNT TABLE
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastnmae = 'Start';


-- RETRIEVE USER DATA FROM THE ACCOUNT TABLE
SELECT * FROM public.account;

-- DELETE A VALUE FROM THE ACCOUNT TABLE

DELETE FROM public.account
WHERE account_id = 1;