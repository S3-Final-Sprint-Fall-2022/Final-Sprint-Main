-- Table: public.queries

-- DROP TABLE IF EXISTS public.queries;

CREATE TABLE IF NOT EXISTS public.queries
(
    query_id integer NOT NULL DEFAULT nextval('queries_query_id_seq'::regclass),
    login_id integer NOT NULL,
    keywords character varying(500) COLLATE pg_catalog."default" NOT NULL,
    query_time timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT queries_pkey PRIMARY KEY (query_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.queries
    OWNER to postgres;