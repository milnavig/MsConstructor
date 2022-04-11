CREATE TABLE public.Doctors (
  id integer ,
  name text ,
  surname text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Doctors OWNER TO postgres;
    
id

CREATE TABLE public.Patient_doctor (
  doctorId integer ,
  patientId integer ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Patient_doctor OWNER TO postgres;
    
ALTER TABLE ONLY public.Patient_doctor
  ADD CONSTRAINT Patient_doctor_pkey PRIMARY KEY (undefined);
ALTER TABLE ONLY public.Patient_doctor
  ADD CONSTRAINT Patient_doctor_pkey FOREIGN KEY (patientId) REFERENCES public.Patients(id);

ALTER TABLE ONLY public.Patient_doctor
  ADD CONSTRAINT Patient_doctor_pkey FOREIGN KEY (doctorId) REFERENCES public.Doctors(id);

CREATE TABLE public.Patients (
  id integer ,
  name text ,
  surname text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Patients OWNER TO postgres;
    
id
