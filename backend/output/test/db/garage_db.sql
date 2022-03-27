CREATE TABLE public.garage (
  name text ,
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.garage OWNER TO postgres;
    
ALTER TABLE ONLY public.garage
  ADD CONSTRAINT garage_pkey PRIMARY KEY (name);


  