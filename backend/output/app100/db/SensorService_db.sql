CREATE TABLE public.Sensors (
  id integer ,
  data text ,
  userId smallint ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Sensors OWNER TO postgres;
    
id
ALTER TABLE ONLY public.Sensors
  ADD CONSTRAINT Sensors_pkey FOREIGN KEY (userId) REFERENCES public.Users(id);

CREATE TABLE public.Users (
  id integer ,
  name text ,
  surname text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.Users OWNER TO postgres;
    
id
