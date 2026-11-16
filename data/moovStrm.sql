--
-- PostgreSQL database dump
--

\restrict cSRNdZsiybaX4ep4KSPdXlXquMDhhXgvwxAmPU7Q71VDg85h00lbZAdtkPRL93t

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-16 17:11:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS moovstrm;
--
-- TOC entry 5078 (class 1262 OID 16500)
-- Name: moovstrm; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE moovstrm WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'French_France.1252';


ALTER DATABASE moovstrm OWNER TO postgres;

\unrestrict cSRNdZsiybaX4ep4KSPdXlXquMDhhXgvwxAmPU7Q71VDg85h00lbZAdtkPRL93t
\connect moovstrm
\restrict cSRNdZsiybaX4ep4KSPdXlXquMDhhXgvwxAmPU7Q71VDg85h00lbZAdtkPRL93t

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 871 (class 1247 OID 17248)
-- Name: enum_users_enablement_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_enablement_status AS ENUM (
    'Enabled',
    'Disabled'
);


ALTER TYPE public.enum_users_enablement_status OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 17260)
-- Name: enum_users_lock_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_lock_status AS ENUM (
    'Locked',
    'Unlocked'
);


ALTER TYPE public.enum_users_lock_status OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 17254)
-- Name: enum_users_login_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_login_status AS ENUM (
    'Online',
    'Offline'
);


ALTER TYPE public.enum_users_login_status OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 17242)
-- Name: enum_users_two_factor_authentication; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_two_factor_authentication AS ENUM (
    'Enabled',
    'Disabled'
);


ALTER TYPE public.enum_users_two_factor_authentication OWNER TO postgres;

--
-- TOC entry 883 (class 1247 OID 17290)
-- Name: enum_users_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_type AS ENUM (
    'Local user',
    'Org user'
);


ALTER TYPE public.enum_users_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16501)
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    metadata json,
    latestupdateby json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17195)
-- Name: Contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contents" (
    id uuid NOT NULL,
    mulr character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "originalName" character varying(255),
    path character varying(255),
    size integer,
    mimetype character varying(255),
    description character varying(255),
    isfree boolean DEFAULT false NOT NULL,
    synopsis character varying(255),
    type_id uuid NOT NULL,
    category_id uuid NOT NULL,
    partner_id uuid NOT NULL,
    parent_id uuid,
    child_id uuid,
    metadata json,
    latestupdateby json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Contents" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16527)
-- Name: Partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Partners" (
    id uuid NOT NULL,
    shortcode character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    metadata json,
    latestupdateby json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Partners" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16514)
-- Name: Types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Types" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    metadata json,
    latestupdateby json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    description character varying(255)
);


ALTER TABLE public."Types" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17265)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    type character varying(50) DEFAULT 'Local user'::character varying NOT NULL,
    username character varying(100) NOT NULL,
    full_name character varying(150) NOT NULL,
    two_factor_authentication public.enum_users_two_factor_authentication DEFAULT 'Disabled'::public.enum_users_two_factor_authentication NOT NULL,
    mobile_number character varying(30),
    email_address character varying(255),
    welcome_message character varying(255),
    enablement_status public.enum_users_enablement_status DEFAULT 'Enabled'::public.enum_users_enablement_status NOT NULL,
    description text,
    department character varying(100),
    password_last_changed timestamp with time zone,
    last_login timestamp with time zone,
    last_logout timestamp with time zone,
    login_status public.enum_users_login_status DEFAULT 'Offline'::public.enum_users_login_status NOT NULL,
    lock_status public.enum_users_lock_status DEFAULT 'Unlocked'::public.enum_users_lock_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5068 (class 0 OID 16501)
-- Dependencies: 219
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Categories" VALUES ('99b19b0c-cb5a-4d36-b345-fae97ddde361', 'WESTERN', 'films WESTERN', NULL, NULL, '2026-09-28 17:17:40.954+02', '2026-09-28 17:17:40.954+02', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public."Categories" VALUES ('7d6c5ced-e819-44ff-8fc6-91c685c60cb8', 'FILM', 'long metrage', NULL, NULL, '2026-09-28 17:24:32.304+02', '2026-09-28 17:24:32.304+02', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 5071 (class 0 OID 17195)
-- Dependencies: 222
-- Data for Name: Contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Contents" VALUES ('365f870d-842d-40d1-8895-4b65fe2c6b1e', 'public/uploads/videos/22899990010/oQ5qj0IdaoxxPRZHBIFAg2CzEVVkiPBIBQ8iE.mp4', 'totorino 228', 'oQ5qj0IdaoxxPRZHBIFAg2CzEVVkiPBIBQ8iE.mp4', 'C:\Users\Riux\Desktop\dev\bun\moovStrm\public\uploads\videos\22899990010\oQ5qj0IdaoxxPRZHBIFAg2CzEVVkiPBIBQ8iE.mp4', 1193840, 'video/mp4', NULL, false, NULL, '80a9b0d5-ec80-4b61-89cb-211f9c898227', '7d6c5ced-e819-44ff-8fc6-91c685c60cb8', '780858fa-f32e-479c-a082-6ff3959db910', NULL, NULL, NULL, NULL, '2026-11-10 12:00:41.787+01', '2026-11-10 12:00:41.787+01', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public."Contents" VALUES ('7cf33bf1-aa3d-48d4-b02f-707e3ab7a80f', 'public/uploads/videos/22899990010/owL1smgufAQeiKtugDVqLSBcqEFkFCmwLtRIJh.mp4', 'deuxieme', 'owL1smgufAQeiKtugDVqLSBcqEFkFCmwLtRIJh.mp4', 'C:\Users\Riux\Desktop\dev\bun\moovStrm\public\uploads\videos\22899990010\owL1smgufAQeiKtugDVqLSBcqEFkFCmwLtRIJh.mp4', 9230064, 'video/mp4', NULL, false, 'test', '80a9b0d5-ec80-4b61-89cb-211f9c898227', '7d6c5ced-e819-44ff-8fc6-91c685c60cb8', '780858fa-f32e-479c-a082-6ff3959db910', NULL, NULL, NULL, NULL, '2026-11-14 21:08:35.603+01', '2026-11-14 21:08:35.603+01', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public."Contents" VALUES ('5d730eeb-6ee5-4199-9b54-5deb41158b83', 'public/uploads/videos/22899990010/oYsswisKdJdaPAgBPEF8Bjg2KpiJAbnYVwkEI.mp4', 'Marius', 'oYsswisKdJdaPAgBPEF8Bjg2KpiJAbnYVwkEI.mp4', 'C:\Users\Riux\Desktop\dev\bun\moovStrm\public\uploads\videos\22899990010\oYsswisKdJdaPAgBPEF8Bjg2KpiJAbnYVwkEI.mp4', 635395, 'video/mp4', NULL, false, NULL, '80a9b0d5-ec80-4b61-89cb-211f9c898227', '7d6c5ced-e819-44ff-8fc6-91c685c60cb8', '780858fa-f32e-479c-a082-6ff3959db910', NULL, NULL, NULL, NULL, '2026-11-14 21:53:51.714+01', '2026-11-14 21:53:51.714+01', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public."Contents" VALUES ('3532e7d3-2ef8-4214-ab5c-be988b7ae178', 'public/uploads/videos/22899990010/oUfq8TR3ECDyEK2E8KFrmIZ5B1EfEgByiMQczA.mp4', 'MOMO29MO', 'oUfq8TR3ECDyEK2E8KFrmIZ5B1EfEgByiMQczA.mp4', 'C:\Users\Riux\Desktop\dev\bun\moovStrm\public\uploads\videos\22899990010\oUfq8TR3ECDyEK2E8KFrmIZ5B1EfEgByiMQczA.mp4', 4617977, 'video/mp4', NULL, false, 'test', '80a9b0d5-ec80-4b61-89cb-211f9c898227', '7d6c5ced-e819-44ff-8fc6-91c685c60cb8', '780858fa-f32e-479c-a082-6ff3959db910', NULL, NULL, NULL, NULL, '2026-11-14 21:56:23.948+01', '2026-11-14 21:56:23.948+01', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 5070 (class 0 OID 16527)
-- Dependencies: 221
-- Data for Name: Partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Partners" VALUES ('780858fa-f32e-479c-a082-6ff3959db910', '22899990010', 'DAVID+', 'DAVID+', NULL, NULL, '2026-09-28 17:31:31.986+02', '2026-09-28 17:31:31.986+02', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 5069 (class 0 OID 16514)
-- Dependencies: 220
-- Data for Name: Types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Types" VALUES ('80a9b0d5-ec80-4b61-89cb-211f9c898227', 'FILM', NULL, NULL, '2026-09-28 17:24:47.734+02', '2026-09-28 17:24:47.734+02', NULL, 'long metrage') ON CONFLICT DO NOTHING;


--
-- TOC entry 5072 (class 0 OID 17265)
-- Dependencies: 223
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4893 (class 2606 OID 16513)
-- Name: Categories Categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key" UNIQUE (name);


--
-- TOC entry 4895 (class 2606 OID 16511)
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 17213)
-- Name: Contents Contents_mulr_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_mulr_key" UNIQUE (mulr);


--
-- TOC entry 4909 (class 2606 OID 17215)
-- Name: Contents Contents_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_name_key" UNIQUE (name);


--
-- TOC entry 4911 (class 2606 OID 17211)
-- Name: Contents Contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_pkey" PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16542)
-- Name: Partners Partners_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partners"
    ADD CONSTRAINT "Partners_name_key" UNIQUE (name);


--
-- TOC entry 4903 (class 2606 OID 16538)
-- Name: Partners Partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partners"
    ADD CONSTRAINT "Partners_pkey" PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16540)
-- Name: Partners Partners_shortcode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partners"
    ADD CONSTRAINT "Partners_shortcode_key" UNIQUE (shortcode);


--
-- TOC entry 4897 (class 2606 OID 16544)
-- Name: Types Types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Types"
    ADD CONSTRAINT "Types_name_key" UNIQUE (name);


--
-- TOC entry 4899 (class 2606 OID 16524)
-- Name: Types Types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Types"
    ADD CONSTRAINT "Types_pkey" PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 17286)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 17288)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4916 (class 2606 OID 17221)
-- Name: Contents Contents_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Categories"(id) ON UPDATE CASCADE;


--
-- TOC entry 4917 (class 2606 OID 17236)
-- Name: Contents Contents_child_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_child_id_fkey" FOREIGN KEY (child_id) REFERENCES public."Contents"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4918 (class 2606 OID 17231)
-- Name: Contents Contents_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."Contents"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4919 (class 2606 OID 17226)
-- Name: Contents Contents_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES public."Partners"(id) ON UPDATE CASCADE;


--
-- TOC entry 4920 (class 2606 OID 17216)
-- Name: Contents Contents_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contents"
    ADD CONSTRAINT "Contents_type_id_fkey" FOREIGN KEY (type_id) REFERENCES public."Types"(id) ON UPDATE CASCADE;


-- Completed on 2026-11-16 17:11:45

--
-- PostgreSQL database dump complete
--

\unrestrict cSRNdZsiybaX4ep4KSPdXlXquMDhhXgvwxAmPU7Q71VDg85h00lbZAdtkPRL93t

