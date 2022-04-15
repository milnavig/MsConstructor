CREATE TABLE public.Sensors (
  id integer,
  data text,
  userId smallint,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Sensors OWNER TO postgres;
    
ALTER TABLE ONLY public.Sensors
  ADD CONSTRAINT Sensors_pkey PRIMARY KEY (id);

CREATE TABLE public.Users (
  id integer,
  name text,
  surname text,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Users OWNER TO postgres;
    
ALTER TABLE ONLY public.Users
  ADD CONSTRAINT Users_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.Sensors
  ADD CONSTRAINT Sensors_fkey_0 FOREIGN KEY (userId) REFERENCES public.Users(id);


