CREATE TABLE public.car (
  id integer ,
  name text ,
  type text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.car OWNER TO postgres;
    
ALTER TABLE ONLY public.car
  ADD CONSTRAINT car_pkey PRIMARY KEY (id);


CREATE TABLE public.type (
  name text ,
  info text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.type OWNER TO postgres;
    
ALTER TABLE ONLY public.type
  ADD CONSTRAINT type_pkey PRIMARY KEY (name);
  ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey FOREIGN KEY (name) REFERENCES car(type);


  