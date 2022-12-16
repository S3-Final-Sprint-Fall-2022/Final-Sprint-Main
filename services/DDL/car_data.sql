-- Table: public.car_data

-- DROP TABLE IF EXISTS public.car_data;

CREATE TABLE IF NOT EXISTS public.car_data
(
    id integer NOT NULL DEFAULT nextval('car_data_id_seq'::regclass),
    car_make character varying(60) COLLATE pg_catalog."default" NOT NULL,
    car_model character varying(60) COLLATE pg_catalog."default" NOT NULL,
    car_model_year character varying(4) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT car_data_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.car_data
    OWNER to postgres;