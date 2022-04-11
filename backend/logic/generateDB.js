
module.exports = function generateDB(tables) {
  const db = 
`${tables.map(t => 
`CREATE TABLE public.${t.name} (
${
  t.fields.map(f => 
`  ${f.name} ${f.datatype}${f.meta ? ` ${f.meta},` : ','}`).join('\n')
}
  "createdAt" time with time zone,
  "updatedAt" time with time zone
);
    
ALTER TABLE public.${t.name} OWNER TO postgres;
    
${t.pk !== undefined ? `ALTER TABLE ONLY public.${t.name}
  ADD CONSTRAINT ${t.name}_pkey PRIMARY KEY (${t.pk});` : ''}
${
  t.fk_array.map(fk => 
`ALTER TABLE ONLY public.${t.name}
  ADD CONSTRAINT ${t.name}_pkey FOREIGN KEY (${fk.name}) REFERENCES public.${fk.table}(${fk.field});
`).join('\n')}`).join('\n')
}`;

  return db;
}