CREATE TABLE IF NOT EXISTS public.tbl_users
(
    id integer NOT NULL DEFAULT nextval('tbl_users_id_seq'::regclass),
    user_name character varying(100) COLLATE pg_catalog."default",
    user_email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    uid character varying(250) COLLATE pg_catalog."default",
    createdon timestamp without time zone DEFAULT now(),
    is_active integer DEFAULT 1,
    last_modified_on timestamp without time zone DEFAULT now(),
    type integer,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tbl_users_pkey PRIMARY KEY (id),
    CONSTRAINT tbl_users_user_email_key UNIQUE (user_email)
)

CREATE TABLE IF NOT EXISTS public.tbl_catalog
(
    id integer NOT NULL DEFAULT nextval('tbl_catalog_id_seq'::regclass),
    user_id integer,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    uid character varying(250) COLLATE pg_catalog."default",
    createdon timestamp without time zone DEFAULT now(),
    is_active integer DEFAULT 1,
    last_modified_on timestamp without time zone DEFAULT now(),
    CONSTRAINT tbl_catalog_pkey PRIMARY KEY (id),
    CONSTRAINT seller_unq UNIQUE (user_id),
    CONSTRAINT tbl_catalog_name_key UNIQUE (name),
    CONSTRAINT fk_catalog FOREIGN KEY (user_id)
        REFERENCES public.tbl_users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.tbl_orders
(
    id integer NOT NULL DEFAULT nextval('tbl_orders_id_seq'::regclass),
    buyer_id integer,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    uid character varying(250) COLLATE pg_catalog."default",
    createdon timestamp without time zone DEFAULT now(),
    is_active integer DEFAULT 1,
    status character varying(500) COLLATE pg_catalog."default",
    last_modified_on timestamp without time zone DEFAULT now(),
    seller_id integer,
    CONSTRAINT tbl_orders_pkey PRIMARY KEY (id),
    CONSTRAINT tbl_orders_name_key UNIQUE (name),
    CONSTRAINT fk_buyer FOREIGN KEY (buyer_id)
        REFERENCES public.tbl_users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT seller_fk FOREIGN KEY (seller_id)
        REFERENCES public.tbl_users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.tbl_products
(
    id integer NOT NULL DEFAULT nextval('tbl_products_id_seq'::regclass),
    catalog_id integer,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    uid character varying(250) COLLATE pg_catalog."default",
    createdon timestamp without time zone DEFAULT now(),
    is_active integer DEFAULT 1,
    last_modified_on timestamp without time zone DEFAULT now(),
    CONSTRAINT tbl_products_pkey PRIMARY KEY (id),
    CONSTRAINT tbl_products_name_key UNIQUE (name),
    CONSTRAINT fk_product FOREIGN KEY (catalog_id)
        REFERENCES public.tbl_catalog (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.tbl_order_list
(
    id integer NOT NULL DEFAULT nextval('tbl_order_list_id_seq'::regclass),
    product_id integer,
    order_id integer,
    createdon timestamp without time zone DEFAULT now(),
    is_active integer DEFAULT 1,
    status character varying(500) COLLATE pg_catalog."default",
    last_modified_on timestamp without time zone DEFAULT now(),
    CONSTRAINT tbl_order_list_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES public.tbl_orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES public.tbl_products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)