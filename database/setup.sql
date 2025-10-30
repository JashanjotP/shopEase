--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-21 11:37:41 IST
CREATE USER cloud_admin WITH PASSWORD 'Icandothis2407';
CREATE USER neon_superuser WITH PASSWORD 'Icandothis2407';

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 57344)
-- Name: addresses; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.addresses (
    id uuid NOT NULL,
    city character varying(255) NOT NULL,
    phone_number character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    street character varying(255) NOT NULL,
    zip_code character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255)
);


ALTER TABLE public.addresses OWNER TO "default";

--
-- TOC entry 220 (class 1259 OID 49152)
-- Name: auth_authority; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.auth_authority (
    id uuid NOT NULL,
    role_code character varying(255) NOT NULL,
    role_description character varying(255) NOT NULL
);


ALTER TABLE public.auth_authority OWNER TO "default";

--
-- TOC entry 221 (class 1259 OID 49159)
-- Name: auth_user_authority; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.auth_user_authority (
    user_id uuid NOT NULL,
    authorities_id uuid NOT NULL
);


ALTER TABLE public.auth_user_authority OWNER TO "default";

--
-- TOC entry 222 (class 1259 OID 49162)
-- Name: auth_user_details; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.auth_user_details (
    id uuid NOT NULL,
    created_on timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    password character varying(255),
    phone_number character varying(255),
    updated_on timestamp(6) without time zone,
    provider character varying(255),
    verification_code character varying(255)
);


ALTER TABLE public.auth_user_details OWNER TO "default";

--
-- TOC entry 215 (class 1259 OID 24576)
-- Name: categories; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    code character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO "default";

--
-- TOC entry 216 (class 1259 OID 24583)
-- Name: category_type; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.category_type (
    id uuid NOT NULL,
    code character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    category_id uuid NOT NULL
);


ALTER TABLE public.category_type OWNER TO "default";

--
-- TOC entry 224 (class 1259 OID 57351)
-- Name: order_items; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    item_price double precision,
    quantity integer NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    product_variant_id uuid
);


ALTER TABLE public.order_items OWNER TO "default";

--
-- TOC entry 225 (class 1259 OID 57356)
-- Name: orders; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    discount double precision,
    expected_delivery_date timestamp(6) without time zone,
    order_date timestamp(6) without time zone,
    order_status character varying(255) NOT NULL,
    payment_method character varying(255) NOT NULL,
    shipment_tracking_number character varying(255),
    total_amount double precision NOT NULL,
    address_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.orders OWNER TO "default";

--
-- TOC entry 226 (class 1259 OID 57364)
-- Name: payment; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.payment (
    id uuid NOT NULL,
    amount double precision NOT NULL,
    payment_date timestamp(6) without time zone NOT NULL,
    payment_method character varying(255) NOT NULL,
    payment_status character varying(255) NOT NULL,
    order_id uuid NOT NULL,
    CONSTRAINT payment_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying])::text[])))
);


ALTER TABLE public.payment OWNER TO "default";

--
-- TOC entry 219 (class 1259 OID 32768)
-- Name: product_resources; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.product_resources (
    id uuid NOT NULL,
    is_primary boolean NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.product_resources OWNER TO "default";

--
-- TOC entry 217 (class 1259 OID 24590)
-- Name: product_variant; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.product_variant (
    id uuid NOT NULL,
    color character varying(255) NOT NULL,
    size character varying(255) NOT NULL,
    stock_quantity integer NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.product_variant OWNER TO "default";

--
-- TOC entry 218 (class 1259 OID 24597)
-- Name: products; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    brand character varying(255) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    description character varying(255),
    is_new_arrival boolean NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(38,2) NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    category_id uuid NOT NULL,
    category_type_id uuid NOT NULL,
    rating real,
    slug character varying(255)
);


ALTER TABLE public.products OWNER TO "default";

--
-- TOC entry 3418 (class 0 OID 57344)
-- Dependencies: 223
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.addresses VALUES ('2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'Gurgaon', '9999000090', 'Haryana', '#2001 New Modern Enclave', '123001', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0', 'Pradeep');
INSERT INTO public.addresses VALUES ('49563ca2-073f-4d7b-a6fb-db1b9d31cfa9', 'CA', '9990001232', 'CA', 'test address', '90012', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0', 'Pardeep');


--
-- TOC entry 3415 (class 0 OID 49152)
-- Dependencies: 220
-- Data for Name: auth_authority; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.auth_authority VALUES ('b9fb12b8-9616-444b-8f07-7e2191135236', 'USER', 'User role');
INSERT INTO public.auth_authority VALUES ('9f885cd2-27c6-4188-b597-1856f51e73d9', 'ADMIN', 'Admin role');


--
-- TOC entry 3416 (class 0 OID 49159)
-- Dependencies: 221
-- Data for Name: auth_user_authority; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.auth_user_authority VALUES ('576270e2-dbe7-47ac-b1f8-fcd2dcf52b9e', 'b9fb12b8-9616-444b-8f07-7e2191135236');
INSERT INTO public.auth_user_authority VALUES ('c5e7a438-dee3-4dd6-9385-dff77c50b1b0', 'b9fb12b8-9616-444b-8f07-7e2191135236');
INSERT INTO public.auth_user_authority VALUES ('c5e7a438-dee3-4dd6-9385-dff77c50b1b0', '9f885cd2-27c6-4188-b597-1856f51e73d9');


--
-- TOC entry 3417 (class 0 OID 49162)
-- Dependencies: 222
-- Data for Name: auth_user_details; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.auth_user_details VALUES ('576270e2-dbe7-47ac-b1f8-fcd2dcf52b9e', NULL, 'pardeep.k@shopease.com', true, 'Pardeep', 'K', '{bcrypt}$2a$10$bGdfjYh39Dvqz.uf1.QJOez0G8KbfuKUmil8EC3M1HgCYjfeET.om', NULL, NULL, NULL, NULL);
INSERT INTO public.auth_user_details VALUES ('c5e7a438-dee3-4dd6-9385-dff77c50b1b0', NULL, 'codereveal.app@gmail.com', true, 'Pardeep', 'K', '{bcrypt}$2a$10$5SgxseS5QeBtzVun.X6Gnehk87XtKtQP2v6QVrGv2oVwvwDE.hofa', NULL, NULL, 'manual', '862401');


--
-- TOC entry 3410 (class 0 OID 24576)
-- Dependencies: 215
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.categories VALUES ('eae057e4-46df-4c08-bc74-26be357690eb', 'MEN', 'Men''s Clothing', 'Men');
INSERT INTO public.categories VALUES ('9a2bb8e0-d8dc-4332-b914-ceb4095b3640', 'WOMEN', 'Women Clothing', 'Women');


--
-- TOC entry 3411 (class 0 OID 24583)
-- Dependencies: 216
-- Data for Name: category_type; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.category_type VALUES ('37d62cce-0558-4879-8a9f-830b7b9c5841', 'JEANS', 'Men''s jeans', 'Jeans', 'eae057e4-46df-4c08-bc74-26be357690eb');
INSERT INTO public.category_type VALUES ('d6e16d78-db97-4830-979d-f377b586dad5', 'SHIRTS', 'Men''s shirts', 'Shirts', 'eae057e4-46df-4c08-bc74-26be357690eb');
INSERT INTO public.category_type VALUES ('2cda36de-c61c-41f4-8e13-af1d8b8b515d', 'SHORTS', 'Men''s shorts', 'Shorts', 'eae057e4-46df-4c08-bc74-26be357690eb');
INSERT INTO public.category_type VALUES ('9f8f396a-81ad-4542-b4ea-11434cd5345e', 'TSHIRTS', 'Men''s t-shirts', 'T-shirts', 'eae057e4-46df-4c08-bc74-26be357690eb');
INSERT INTO public.category_type VALUES ('eaa4e5da-6c6f-4262-9343-152031e0f433', 'HOODIE', 'Men''s Hoodie', 'Hoodie''s', 'eae057e4-46df-4c08-bc74-26be357690eb');
INSERT INTO public.category_type VALUES ('2a24f378-2b25-4700-a644-d3f850d7411c', 'CROPTOP', 'Crop Top', 'CROPTOP', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('658627fb-9889-4c46-9a68-8eadee4aa67e', 'SHORTS', 'Shorts', 'SHORTS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('200557d7-9d51-4a2b-b2fb-b664913108c5', 'JEANS', 'Jeans', 'JEANS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('7f97e8c8-72ef-4450-a98c-e53355f7c61e', 'TSHIRTS', 'T-shirt', 'TSHIRTS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('1b5bce66-604a-489f-a7d3-487ad1760302', 'SWEATSHIRT', 'Hoodie/Sweatshirt', 'SWEATSHIRT', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('4a219186-87e8-4fee-91e8-9b57736e03e6', 'TOPS', 'Tops', 'TOPS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('9279ab95-bf98-4aa0-a665-1e17ede0d049', 'BOXERS', 'Boxers', 'BOXERS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('a5017e68-b7c5-4ae9-a6e1-57ce6758d5b4', 'KURTIS', 'Kurtis', 'KURTIS', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('5b5419cf-d83b-4084-b29b-fadf8f7b2de7', 'DRESSES', 'Dresses', 'DRESSES', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640');
INSERT INTO public.category_type VALUES ('0f448fea-bfe3-449d-afcf-3150813068c4', 'SWSHIRT', 'Sweatshirt', 'Sweatshirt', 'eae057e4-46df-4c08-bc74-26be357690eb');


--
-- TOC entry 3419 (class 0 OID 57351)
-- Dependencies: 224
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.order_items VALUES ('c06e4b23-cb9a-4741-bbd5-222b918d4f07', NULL, 2, '33bb3f4b-3070-4829-bc7f-fa9d57290768', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('d456329a-0aae-4f51-92eb-30677925ab79', NULL, 1, '33bb3f4b-3070-4829-bc7f-fa9d57290768', '3bb694c1-86dd-4df8-b016-1da5f4de5ae7', 'bf2eb3d4-332b-4368-b898-c20eba98a01e');
INSERT INTO public.order_items VALUES ('74a0bb44-396f-42bd-be9c-da2f9656acb6', NULL, 1, '33bb3f4b-3070-4829-bc7f-fa9d57290768', 'd6404efc-ca9c-47b8-9b8c-8f6779409788', '8d043763-32d6-4920-bc30-20f45a87dcd1');
INSERT INTO public.order_items VALUES ('c299916a-a489-4fb8-81c6-9a3e2ac4f72c', NULL, 1, '33bb3f4b-3070-4829-bc7f-fa9d57290768', '243d6af6-8a09-442f-ba2e-8a22168de602', 'a5d96c18-d61b-4efd-ac2f-1b7503bd483e');
INSERT INTO public.order_items VALUES ('56b99536-5a41-4afa-afab-be54563c1b1b', NULL, 1, 'fa7a768e-1e55-45c3-8493-7f7f6a950e49', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '77265b0a-c7e3-47ab-90db-8f9f07c7142e');
INSERT INTO public.order_items VALUES ('b70b04f0-7693-4191-8f6b-0ec667efc330', NULL, 1, 'fa7a768e-1e55-45c3-8493-7f7f6a950e49', '9f38cf13-9827-446f-8293-c01bc8ca3cdf', '013bb4d6-ea90-4dc9-a912-ebf4e91e3eaa');
INSERT INTO public.order_items VALUES ('4b02f742-ef2c-4e06-b8d6-5150ccab5c7c', NULL, 1, 'a4292b07-e14e-48de-9b61-f7069ae3c384', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('aa0451e7-94e6-46bd-91f9-2b3dea26fd39', NULL, 1, 'a4292b07-e14e-48de-9b61-f7069ae3c384', 'abb44828-c2d2-4b93-8e99-de11de710ba4', 'dadc4e1c-0094-451b-a58d-5dacf0996b1d');
INSERT INTO public.order_items VALUES ('6268959d-dab5-4284-bc2d-315e046d3d89', NULL, 1, '880283b1-d517-4aae-81c1-d6f30746e615', '641c3dc1-0fbf-46e2-96c1-6af5d1037dec', '39a30df2-f461-476a-8042-b2244be3a630');
INSERT INTO public.order_items VALUES ('16e887d0-0d1e-46a2-8905-b46e386351e7', NULL, 1, '880283b1-d517-4aae-81c1-d6f30746e615', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('9eade14b-baf4-426d-ad47-03641a206845', NULL, 1, 'd8be2d2b-4640-42e8-88d7-6cdd36835743', '641c3dc1-0fbf-46e2-96c1-6af5d1037dec', '39a30df2-f461-476a-8042-b2244be3a630');
INSERT INTO public.order_items VALUES ('ba39f5b2-81d2-4a99-ba4c-6821ad66bfc7', NULL, 1, 'd8be2d2b-4640-42e8-88d7-6cdd36835743', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('6872a89f-6ff6-4325-af8c-9d2e7517f798', NULL, 1, '3146a0c9-0ac5-432e-aaf5-dc2554ea330f', '641c3dc1-0fbf-46e2-96c1-6af5d1037dec', '39a30df2-f461-476a-8042-b2244be3a630');
INSERT INTO public.order_items VALUES ('da9b9168-2505-4b2a-83d8-cd77194283af', NULL, 1, '3146a0c9-0ac5-432e-aaf5-dc2554ea330f', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('d8385d8c-6cf4-4081-8542-86869d5511ee', NULL, 1, '57cc1308-73d2-436d-8b41-fd08a2d0a7a6', 'd6404efc-ca9c-47b8-9b8c-8f6779409788', 'b903de6b-c094-44d0-a7e3-7cd58fb5d2f5');
INSERT INTO public.order_items VALUES ('32631d0d-df95-4bfe-b308-f03636132567', NULL, 1, '57cc1308-73d2-436d-8b41-fd08a2d0a7a6', '3bb694c1-86dd-4df8-b016-1da5f4de5ae7', '19cb261e-a5b0-4ba7-8f11-61897545713e');
INSERT INTO public.order_items VALUES ('829c7ea2-3828-4ca0-9544-e6af7d18e256', NULL, 2, '57cc1308-73d2-436d-8b41-fd08a2d0a7a6', 'abb44828-c2d2-4b93-8e99-de11de710ba4', '1a391b42-c281-4ddf-9e7c-6004dac2b596');
INSERT INTO public.order_items VALUES ('e3dc3713-5a0d-499d-b758-e39d4e835233', NULL, 1, '57cc1308-73d2-436d-8b41-fd08a2d0a7a6', '5c59e285-3e69-46a5-a1b0-b67ddfb73785', '4efba7dc-16fa-4daf-bbc1-f71bb12c5e90');
INSERT INTO public.order_items VALUES ('d4cbd4e9-3d12-4011-942d-ce231fdd4be6', NULL, 1, 'fe81da53-7595-4a3d-aba3-08b93c8812e0', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('76b9442a-59bb-4759-959a-1b2e3f13c07a', NULL, 1, '36f9ee18-b113-46a7-a821-2e3755a82955', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('95784a43-a298-4993-9829-f3a52e04047d', NULL, 1, '2af01bc5-339e-4357-80c6-14c3ecf518b4', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '934d5af0-85c2-4867-92a0-876a783f8924');
INSERT INTO public.order_items VALUES ('0e22d730-f428-4c88-ae94-cec55c062cc6', NULL, 1, '2af01bc5-339e-4357-80c6-14c3ecf518b4', '243d6af6-8a09-442f-ba2e-8a22168de602', 'a5d96c18-d61b-4efd-ac2f-1b7503bd483e');
INSERT INTO public.order_items VALUES ('37d97b47-d280-4313-9d9c-1f1086678cca', NULL, 1, 'dbe799b0-59f8-4d07-911b-4cab096f9143', '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0', 'd63bed52-eae2-4da8-a0c5-9b09ccc4b3d2');
INSERT INTO public.order_items VALUES ('5918f17b-dd39-4867-8124-b5f849f883c3', NULL, 1, '5a4c20c9-aed5-43f1-9a8e-347d0a3caca9', '34a65b3e-72f3-4e69-b098-332f60c2cc14', '82057d28-b15e-4123-a5ef-30efb9545beb');


--
-- TOC entry 3420 (class 0 OID 57356)
-- Dependencies: 225
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.orders VALUES ('2af01bc5-339e-4357-80c6-14c3ecf518b4', 0, '2024-10-06 02:41:46.202', '2024-10-24 02:11:25.59', 'CANCELLED', 'pm_1QDBN1SH9sW9ZElpANguNSe9', NULL, 80.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('dbe799b0-59f8-4d07-911b-4cab096f9143', 0, '2024-10-06 02:41:46.202', '2024-10-29 18:21:31.522', 'IN_PROGRESS', 'pm_1QFEtfSH9sW9ZElp3CgbMFIz', NULL, 49.99, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('33bb3f4b-3070-4829-bc7f-fa9d57290768', 0, '2024-10-06 02:41:46.202', '2024-09-30 16:17:42.895', 'CANCELLED', 'pm_1Q4h8rSH9sW9ZElpgQZn8Zms', NULL, 231.95, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('fa7a768e-1e55-45c3-8493-7f7f6a950e49', 0, '2024-10-06 02:41:46.202', '2024-10-02 21:46:18.907', 'CANCELLED', 'pm_1Q5VDwSH9sW9ZElpv60c3oMg', NULL, 95.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('a4292b07-e14e-48de-9b61-f7069ae3c384', 0, '2024-10-06 02:41:46.202', '2024-10-07 11:51:10.757', 'CANCELLED', 'pm_1Q7AJkSH9sW9ZElpdCiLg6mY', NULL, 135.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('880283b1-d517-4aae-81c1-d6f30746e615', 0, '2024-10-06 02:41:46.202', '2024-10-21 01:07:08.124', 'CANCELLED', 'CARD', NULL, 95.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('5a4c20c9-aed5-43f1-9a8e-347d0a3caca9', 0, '2024-10-06 02:41:46.202', '2024-12-22 12:28:07.278', 'PENDING', 'CARD', NULL, 55.99, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('57cc1308-73d2-436d-8b41-fd08a2d0a7a6', 0, '2024-10-06 02:41:46.202', '2024-10-24 01:40:41.112', 'IN_PROGRESS', 'pm_1QDAtHSH9sW9ZElpJRlOBijX', NULL, 314.95, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('d8be2d2b-4640-42e8-88d7-6cdd36835743', 0, '2024-10-06 02:41:46.202', '2024-10-21 01:16:43.154', 'CANCELLED', 'CARD', NULL, 95.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('3146a0c9-0ac5-432e-aaf5-dc2554ea330f', 0, '2024-10-06 02:41:46.202', '2024-10-21 01:17:46.46', 'CANCELLED', 'pm_1QC56RSH9sW9ZElpRg5oIoKq', NULL, 95.98, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('fe81da53-7595-4a3d-aba3-08b93c8812e0', 0, '2024-10-06 02:41:46.202', '2024-10-24 01:58:48.508', 'CANCELLED', 'pm_1QDBAnSH9sW9ZElp8ifHcj4V', NULL, 55.99, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');
INSERT INTO public.orders VALUES ('36f9ee18-b113-46a7-a821-2e3755a82955', 0, '2024-10-06 02:41:46.202', '2024-10-24 02:01:29.836', 'CANCELLED', 'pm_1QDBDPSH9sW9ZElpv6PK138u', NULL, 55.99, '2816909e-25b1-4c54-b5b6-5c7c7026bbcd', 'c5e7a438-dee3-4dd6-9385-dff77c50b1b0');


--
-- TOC entry 3421 (class 0 OID 57364)
-- Dependencies: 226
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.payment VALUES ('2dc97607-3d6d-453c-96a9-df6e2b972b71', 231.95, '2024-09-30 16:17:45.701', 'pm_1Q4h8rSH9sW9ZElpgQZn8Zms', 'COMPLETED', '33bb3f4b-3070-4829-bc7f-fa9d57290768');
INSERT INTO public.payment VALUES ('b2a1250c-afc5-4b7e-a24f-1a1a47be794a', 95.98, '2024-10-02 21:46:21.153', 'pm_1Q5VDwSH9sW9ZElpv60c3oMg', 'COMPLETED', 'fa7a768e-1e55-45c3-8493-7f7f6a950e49');
INSERT INTO public.payment VALUES ('03062aa7-904d-4c9d-a673-8e61920720e9', 135.98, '2024-10-07 11:51:13.199', 'pm_1Q7AJkSH9sW9ZElpdCiLg6mY', 'COMPLETED', 'a4292b07-e14e-48de-9b61-f7069ae3c384');
INSERT INTO public.payment VALUES ('7e8d3bd8-3da5-4203-9e95-7064b102ef53', 95.98, '2024-10-21 01:07:10.327', 'CARD', 'PENDING', '880283b1-d517-4aae-81c1-d6f30746e615');
INSERT INTO public.payment VALUES ('2e717124-088c-41f4-835f-a59f22c6b92b', 95.98, '2024-10-21 01:16:45.509', 'CARD', 'PENDING', 'd8be2d2b-4640-42e8-88d7-6cdd36835743');
INSERT INTO public.payment VALUES ('386a9c27-914f-4506-8faa-74044b917e3f', 95.98, '2024-10-21 01:17:48.937', 'pm_1QC56RSH9sW9ZElpRg5oIoKq', 'COMPLETED', '3146a0c9-0ac5-432e-aaf5-dc2554ea330f');
INSERT INTO public.payment VALUES ('7874ea69-d0d5-49b5-af02-470f57819f4c', 314.95, '2024-10-24 01:40:44.187', 'pm_1QDAtHSH9sW9ZElpJRlOBijX', 'COMPLETED', '57cc1308-73d2-436d-8b41-fd08a2d0a7a6');
INSERT INTO public.payment VALUES ('353a060e-5972-4739-9d3d-673be8530bbb', 55.99, '2024-10-24 01:58:50.67', 'pm_1QDBAnSH9sW9ZElp8ifHcj4V', 'COMPLETED', 'fe81da53-7595-4a3d-aba3-08b93c8812e0');
INSERT INTO public.payment VALUES ('a0374c51-5991-4a75-9397-dde99576c37c', 55.99, '2024-10-24 02:01:32.054', 'pm_1QDBDPSH9sW9ZElpv6PK138u', 'COMPLETED', '36f9ee18-b113-46a7-a821-2e3755a82955');
INSERT INTO public.payment VALUES ('fb789e67-1c3b-4832-8bda-ab34a5723af6', 80.98, '2024-10-24 02:11:28.005', 'pm_1QDBN1SH9sW9ZElpANguNSe9', 'COMPLETED', '2af01bc5-339e-4357-80c6-14c3ecf518b4');
INSERT INTO public.payment VALUES ('1502b5f4-4298-4699-915f-50ff0061c688', 49.99, '2024-10-29 18:21:34.982', 'pm_1QFEtfSH9sW9ZElp3CgbMFIz', 'COMPLETED', 'dbe799b0-59f8-4d07-911b-4cab096f9143');
INSERT INTO public.payment VALUES ('41658e91-3360-42a8-b406-d3e806658efb', 55.99, '2024-12-22 12:28:09.466', 'CARD', 'PENDING', '5a4c20c9-aed5-43f1-9a8e-347d0a3caca9');


--
-- TOC entry 3414 (class 0 OID 32768)
-- Dependencies: 219
-- Data for Name: product_resources; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.product_resources VALUES ('07749168-ec81-4d96-b9ed-5aae3c57f4c1', true, 'black-tshirt1.jpg', 'image', 'https://codedev.b-cdn.net/products/black-tshirt.jpeg', '243d6af6-8a09-442f-ba2e-8a22168de602');
INSERT INTO public.product_resources VALUES ('45d5b345-8e3d-4a01-bc87-97893fc76cd9', false, 'black-tshirt2.jpg', 'image', 'https://codedev.b-cdn.net/products/black-tshirt.jpeg', '243d6af6-8a09-442f-ba2e-8a22168de602');
INSERT INTO public.product_resources VALUES ('e4c0a1a2-bab9-4f2a-8d5b-67136fb9231d', true, 'white-hoodie1.jpg', 'image', 'https://codedev.b-cdn.net/products/white-hoodie.jpeg', '5c59e285-3e69-46a5-a1b0-b67ddfb73785');
INSERT INTO public.product_resources VALUES ('ad472cda-8c55-4cd0-983e-bcb003342e40', false, 'white-hoodie2.jpg', 'image', 'https://codedev.b-cdn.net/products/white-hoodie.jpeg', '5c59e285-3e69-46a5-a1b0-b67ddfb73785');
INSERT INTO public.product_resources VALUES ('20677225-1cbf-44e1-9c91-f2aec4fc611b', true, 'sweatshirt-black.jpg', 'image', 'https://codedev.b-cdn.net/products/sweatshirt-black.jpg', '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_resources VALUES ('412a0111-6dec-483f-b944-4f3b03684d01', false, 'woman-black-shirt-giving-neutral-flirtatious-poses.jpg', 'image', 'https://codedev.b-cdn.net/products/woman-black-shirt-giving-neutral-flirtatious-poses.jpg', '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_resources VALUES ('9a3998a8-c8a2-444a-a89d-dc9311dbdd8a', false, 'woman-holding-coffee-cup-smiling.jpg', 'image', 'https://codedev.b-cdn.net/products/woman-holding-coffee-cup-smiling.jpg', '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_resources VALUES ('2d8b6d55-019d-4405-9a6a-8cfaf44e9679', true, 'tshirt-white.jpg', 'image', 'https://codedev.b-cdn.net/products/tshirt-white.jpg', '69279cd7-2c32-4aa7-a1a7-80a0365990c0');
INSERT INTO public.product_resources VALUES ('d64cf250-2cd7-45e5-a7cd-c4f12408a8da', false, 'tshirt-white.jpg', 'image', 'https://codedev.b-cdn.net/products/tshirt-white.jpg', '69279cd7-2c32-4aa7-a1a7-80a0365990c0');
INSERT INTO public.product_resources VALUES ('c5521c92-5e93-4f88-bf72-abd7a5089236', true, 'hoodie-purple1.jpg', 'image', 'https://codedev.b-cdn.net/products/hoodie-purple.jpg', '3bb694c1-86dd-4df8-b016-1da5f4de5ae7');
INSERT INTO public.product_resources VALUES ('60a9fa55-283a-45f3-a9ac-a6f018f6e2e3', false, 'hoodie-purple2.jpg', 'image', 'https://codedev.b-cdn.net/products/hoodie-purple.jpg', '3bb694c1-86dd-4df8-b016-1da5f4de5ae7');
INSERT INTO public.product_resources VALUES ('5b17a573-e9aa-44b5-99ec-20d2f50bdbef', true, 'dress-white-leaves1.jpg', 'image', 'https://codedev.b-cdn.net/products/dress-white-leaves.jpg', 'abb44828-c2d2-4b93-8e99-de11de710ba4');
INSERT INTO public.product_resources VALUES ('11ea5deb-3c50-4ff8-aa5d-4af888e6908b', false, 'dress-white-leaves2.jpg', 'image', 'https://codedev.b-cdn.net/products/dress-white-leaves.jpg', 'abb44828-c2d2-4b93-8e99-de11de710ba4');
INSERT INTO public.product_resources VALUES ('9273a307-3b7e-4095-a7df-ecf8f6edb4ed', true, 'crop-top-white1.jpg', 'image', 'https://codedev.b-cdn.net/products/crop-top-white.jpeg', '9f38cf13-9827-446f-8293-c01bc8ca3cdf');
INSERT INTO public.product_resources VALUES ('20acb394-8c19-4479-ace6-a8c5868aad8a', false, 'crop-top-white2.jpg', 'image', 'https://codedev.b-cdn.net/products/crop-top-white.jpeg', '9f38cf13-9827-446f-8293-c01bc8ca3cdf');
INSERT INTO public.product_resources VALUES ('7ff1464f-5fba-4cc7-bada-72d512536e21', true, 'shorts-black1.jpg', 'image', 'https://codedev.b-cdn.net/products/shorts-black.jpeg', '5670f360-f80f-443c-bfcc-5d95522fa155');
INSERT INTO public.product_resources VALUES ('3ad90c06-7378-4a86-9c07-63381442169e', false, 'shorts-black2.jpg', 'image', 'https://codedev.b-cdn.net/products/shorts-black.jpeg', '5670f360-f80f-443c-bfcc-5d95522fa155');
INSERT INTO public.product_resources VALUES ('9323b287-0e50-45fe-8854-dff0cb11fe9e', true, 'tshirt-black1.jpg', 'image', 'https://codedev.b-cdn.net/products/tshirt-black.jpg', 'd6404efc-ca9c-47b8-9b8c-8f6779409788');
INSERT INTO public.product_resources VALUES ('c2967f04-936c-4bbc-99fb-eebb88a6aa8c', false, 'tshirt-black2.jpg', 'image', 'https://codedev.b-cdn.net/products/tshirt-black.jpg', 'd6404efc-ca9c-47b8-9b8c-8f6779409788');
INSERT INTO public.product_resources VALUES ('acda5fbf-e153-4309-960f-1f31800a8250', true, 'jeans-blue1.jpg', 'image', 'https://codedev.b-cdn.net/products/jeans-blue.jpeg', 'c64f23b7-ca78-4fab-8097-3a58221dbdaf');
INSERT INTO public.product_resources VALUES ('ba09aa4e-6104-43ac-b0ff-cf69b88d33c9', false, 'jeans-blue2.jpg', 'image', 'https://codedev.b-cdn.net/products/jeans-blue.jpeg', 'c64f23b7-ca78-4fab-8097-3a58221dbdaf');
INSERT INTO public.product_resources VALUES ('0200c147-cc10-4937-9353-67c0fafa29e4', true, 'sweatshirt-gray1.jpg', 'image', 'https://codedev.b-cdn.net/products/sweatshirt-crewneck.jpeg', 'b287c075-fc07-4828-8d31-976ba899c5b7');
INSERT INTO public.product_resources VALUES ('0c4f6512-ac1e-4854-89cf-4d5037ef9000', false, 'sweatshirt-gray2.jpg', 'image', 'https://codedev.b-cdn.net/products/sweatshirt-crewneck.jpeg', 'b287c075-fc07-4828-8d31-976ba899c5b7');
INSERT INTO public.product_resources VALUES ('2a71d164-1e61-410e-8015-94c36b578382', true, 'shorts-denim1.jpg', 'image', 'https://codedev.b-cdn.net/products/shorts-denim.jpeg', '641c3dc1-0fbf-46e2-96c1-6af5d1037dec');
INSERT INTO public.product_resources VALUES ('525e3311-b58f-4490-8731-35b02204bf7e', false, 'shorts-denim2.jpg', 'image', 'https://codedev.b-cdn.net/products/shorts-denim.jpeg', '641c3dc1-0fbf-46e2-96c1-6af5d1037dec');
INSERT INTO public.product_resources VALUES ('a06be511-df30-411e-84fb-6ab092dea24f', true, 'black-tshirt-001', 'image', 'https://codedev.b-cdn.net/Onboarding-Preview.png', '01c5b6d2-1439-4179-89c9-84f32a833640');
INSERT INTO public.product_resources VALUES ('739175cd-09f1-4a9e-b472-cadb1c6ee0f7', true, 'black-tshirt-2024', 'image', 'https://codedev.b-cdn.net/tattooed-biker-hand-hold-tshirt.jpg', '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_resources VALUES ('5f3a4b6f-02fc-4ed6-afbe-54066b4dd7df', true, 'test', 'image', 'https://codedev.b-cdn.net/background.png', 'f132315a-852f-4518-8c54-d7db0994741c');


--
-- TOC entry 3412 (class 0 OID 24590)
-- Dependencies: 217
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.product_variant VALUES ('c77355c1-ddf8-47cb-a4b9-60f502dda2da', 'Black', 'M', 1, '243d6af6-8a09-442f-ba2e-8a22168de602');
INSERT INTO public.product_variant VALUES ('154718f4-cb0b-4085-b1e9-cff337294b9e', 'Black', 'L', 1, '243d6af6-8a09-442f-ba2e-8a22168de602');
INSERT INTO public.product_variant VALUES ('a5d96c18-d61b-4efd-ac2f-1b7503bd483e', 'Black', 'XL', 1, '243d6af6-8a09-442f-ba2e-8a22168de602');
INSERT INTO public.product_variant VALUES ('23c35c22-461b-4ac7-ac47-fa2e9d501e6a', 'White', 'M', 1, '5c59e285-3e69-46a5-a1b0-b67ddfb73785');
INSERT INTO public.product_variant VALUES ('d3c8776b-8015-4d51-8eed-c68c187971d2', 'White', 'L', 1, '5c59e285-3e69-46a5-a1b0-b67ddfb73785');
INSERT INTO public.product_variant VALUES ('4efba7dc-16fa-4daf-bbc1-f71bb12c5e90', 'White', 'XL', 1, '5c59e285-3e69-46a5-a1b0-b67ddfb73785');
INSERT INTO public.product_variant VALUES ('82057d28-b15e-4123-a5ef-30efb9545beb', 'Black', 'S', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('77265b0a-c7e3-47ab-90db-8f9f07c7142e', 'Black', 'M', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('934d5af0-85c2-4867-92a0-876a783f8924', 'Black', 'L', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('f57640c5-e13f-4f3b-8018-d34b77230f41', 'Blue', 'S', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('01ee67a3-5798-4b10-9112-93a76c71cfdf', 'Blue', 'M', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('084930b5-e8ab-4c6f-a5d2-586e88837148', 'Blue', 'L', 1, '34a65b3e-72f3-4e69-b098-332f60c2cc14');
INSERT INTO public.product_variant VALUES ('1a43eb75-f1de-4826-a6c5-d1293bb0334e', 'White', 'S', 1, '69279cd7-2c32-4aa7-a1a7-80a0365990c0');
INSERT INTO public.product_variant VALUES ('551cd9ca-9b55-46b8-bb0a-5040b60b9550', 'White', 'M', 1, '69279cd7-2c32-4aa7-a1a7-80a0365990c0');
INSERT INTO public.product_variant VALUES ('aa76cd66-8ae9-4faf-bead-e4e252ed303b', 'White', 'L', 1, '69279cd7-2c32-4aa7-a1a7-80a0365990c0');
INSERT INTO public.product_variant VALUES ('9aea7f38-3d2b-4757-beee-8186e8c6aa7b', 'Purple', 'S', 1, '3bb694c1-86dd-4df8-b016-1da5f4de5ae7');
INSERT INTO public.product_variant VALUES ('19cb261e-a5b0-4ba7-8f11-61897545713e', 'Purple', 'M', 1, '3bb694c1-86dd-4df8-b016-1da5f4de5ae7');
INSERT INTO public.product_variant VALUES ('bf2eb3d4-332b-4368-b898-c20eba98a01e', 'Purple', 'L', 1, '3bb694c1-86dd-4df8-b016-1da5f4de5ae7');
INSERT INTO public.product_variant VALUES ('ce7ca19e-9b9a-4477-be98-14a7f97d1fbb', 'White', 'S', 1, 'abb44828-c2d2-4b93-8e99-de11de710ba4');
INSERT INTO public.product_variant VALUES ('dadc4e1c-0094-451b-a58d-5dacf0996b1d', 'White', 'M', 1, 'abb44828-c2d2-4b93-8e99-de11de710ba4');
INSERT INTO public.product_variant VALUES ('1a391b42-c281-4ddf-9e7c-6004dac2b596', 'White', 'L', 1, 'abb44828-c2d2-4b93-8e99-de11de710ba4');
INSERT INTO public.product_variant VALUES ('ec52d746-04e4-4fee-9821-76e25035e4cb', 'White', 'S', 1, '9f38cf13-9827-446f-8293-c01bc8ca3cdf');
INSERT INTO public.product_variant VALUES ('71556603-5691-4e06-ab8a-c9cffa43ffd5', 'White', 'M', 1, '9f38cf13-9827-446f-8293-c01bc8ca3cdf');
INSERT INTO public.product_variant VALUES ('013bb4d6-ea90-4dc9-a912-ebf4e91e3eaa', 'White', 'L', 1, '9f38cf13-9827-446f-8293-c01bc8ca3cdf');
INSERT INTO public.product_variant VALUES ('59d03b3d-12b1-460e-b94f-785458474a85', 'Black', 'S', 1, '5670f360-f80f-443c-bfcc-5d95522fa155');
INSERT INTO public.product_variant VALUES ('12ed9722-d054-4bee-b932-9ce3e24c1acd', 'Black', 'M', 1, '5670f360-f80f-443c-bfcc-5d95522fa155');
INSERT INTO public.product_variant VALUES ('af6a7198-e6bf-4070-954f-a7574bfb919d', 'Black', 'L', 1, '5670f360-f80f-443c-bfcc-5d95522fa155');
INSERT INTO public.product_variant VALUES ('0058e709-7b46-4268-a2d9-ee9b434e3a1b', 'Blue', 'S', 1, 'c64f23b7-ca78-4fab-8097-3a58221dbdaf');
INSERT INTO public.product_variant VALUES ('57e04abc-d788-4a11-b7b3-1c9836038bba', 'Blue', 'M', 1, 'c64f23b7-ca78-4fab-8097-3a58221dbdaf');
INSERT INTO public.product_variant VALUES ('fccafdfa-f072-42a0-a479-7bbdef771708', 'Blue', 'L', 1, 'c64f23b7-ca78-4fab-8097-3a58221dbdaf');
INSERT INTO public.product_variant VALUES ('b371d822-3f61-412d-80a7-1bbb766dfa5f', 'Gray', 'S', 1, 'b287c075-fc07-4828-8d31-976ba899c5b7');
INSERT INTO public.product_variant VALUES ('00fb75ee-a055-4ce7-a8f2-aa9884fcaaf4', 'Gray', 'M', 1, 'b287c075-fc07-4828-8d31-976ba899c5b7');
INSERT INTO public.product_variant VALUES ('5c6e2a28-816c-4055-bfe1-e95dcb7c658b', 'Gray', 'L', 1, 'b287c075-fc07-4828-8d31-976ba899c5b7');
INSERT INTO public.product_variant VALUES ('cdea3326-d310-42c7-b33c-bda49ce91560', 'Blue', 'S', 1, '641c3dc1-0fbf-46e2-96c1-6af5d1037dec');
INSERT INTO public.product_variant VALUES ('b10beff6-e77b-4080-827b-c6e31e21e44d', 'Blue', 'M', 1, '641c3dc1-0fbf-46e2-96c1-6af5d1037dec');
INSERT INTO public.product_variant VALUES ('39a30df2-f461-476a-8042-b2244be3a630', 'Blue', 'L', 1, '641c3dc1-0fbf-46e2-96c1-6af5d1037dec');
INSERT INTO public.product_variant VALUES ('4a11f788-b652-49c5-9e88-07eff8e42886', 'Black', 'S', 1, 'd6404efc-ca9c-47b8-9b8c-8f6779409788');
INSERT INTO public.product_variant VALUES ('8d043763-32d6-4920-bc30-20f45a87dcd1', 'Black', 'M', 1, 'd6404efc-ca9c-47b8-9b8c-8f6779409788');
INSERT INTO public.product_variant VALUES ('b903de6b-c094-44d0-a7e3-7cd58fb5d2f5', 'Black', 'L', 1, 'd6404efc-ca9c-47b8-9b8c-8f6779409788');
INSERT INTO public.product_variant VALUES ('dcbc3382-61f9-40d2-85c8-75da1e7662df', 'Black', 'S', 1, '01c5b6d2-1439-4179-89c9-84f32a833640');
INSERT INTO public.product_variant VALUES ('044ba59e-15a8-4583-8ce3-3e170582ee97', 'Black', 'M', 1, '01c5b6d2-1439-4179-89c9-84f32a833640');
INSERT INTO public.product_variant VALUES ('93db94cf-c8c1-4636-b59c-dd4166e99740', 'Black', 'L', 1, '01c5b6d2-1439-4179-89c9-84f32a833640');
INSERT INTO public.product_variant VALUES ('4fa71289-13e4-471d-960f-030280f8b948', 'Black', 'XL', 1, '01c5b6d2-1439-4179-89c9-84f32a833640');
INSERT INTO public.product_variant VALUES ('3d239e3d-a278-48f0-a005-ea09ce0063bd', 'Black', 'S', 1, '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_variant VALUES ('146354fc-97b4-4a68-8b37-53280da7436c', 'Black', 'M', 1, '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_variant VALUES ('a0b483b5-7393-4967-948e-a698e7f6c236', 'Black', 'L', 1, '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_variant VALUES ('d63bed52-eae2-4da8-a0c5-9b09ccc4b3d2', 'Black', 'XL', 1, '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_variant VALUES ('3fc59003-1e6e-4a64-bb58-802f9e934c54', 'Black', 'XXL', 1, '5e433553-38bd-40e0-aee6-3a6ca3d7f7e0');
INSERT INTO public.product_variant VALUES ('19c9ca80-ebd6-40f8-b772-264962e62667', 'Yellow', 'S', 1, 'f132315a-852f-4518-8c54-d7db0994741c');


--
-- TOC entry 3413 (class 0 OID 24597)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: default
--

INSERT INTO public.products VALUES ('641c3dc1-0fbf-46e2-96c1-6af5d1037dec', 'SummerVibes', '2024-09-28 15:16:41.84', 'Stylish denim shorts for women', true, 'Denim Shorts New', 39.99, '2024-10-24 03:16:22.164', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '658627fb-9889-4c46-9a68-8eadee4aa67e', 4.7, 'denim-shorts-b8de4ac5');
INSERT INTO public.products VALUES ('34a65b3e-72f3-4e69-b098-332f60c2cc14', 'Nike', '2024-09-01 13:23:59.317', '100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.', true, 'Black Sweatshirt New', 55.99, '2024-10-24 03:17:05.263', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '1b5bce66-604a-489f-a7d3-487ad1760302', 4.5, 'black-sweatshirt-1');
INSERT INTO public.products VALUES ('01c5b6d2-1439-4179-89c9-84f32a833640', 'Nike', '2024-10-29 17:51:03.558', 'black tshirt', false, 'Black Tshirt New', 49.99, '2024-10-29 17:51:03.558', 'eae057e4-46df-4c08-bc74-26be357690eb', '9f8f396a-81ad-4542-b4ea-11434cd5345e', NULL, 'black-tshirt-0001');
INSERT INTO public.products VALUES ('243d6af6-8a09-442f-ba2e-8a22168de602', 'Nike', '2024-08-31 23:02:25.237', 'Classic black t-shirt for men', true, 'Black T-Shirt', 24.99, '2024-09-16 00:34:36.317', 'eae057e4-46df-4c08-bc74-26be357690eb', '9f8f396a-81ad-4542-b4ea-11434cd5345e', NULL, 'black-tshirt-1');
INSERT INTO public.products VALUES ('5c59e285-3e69-46a5-a1b0-b67ddfb73785', 'Adidas', '2024-09-01 13:10:57.5', 'Comfortable white hoodie for men', true, 'White Hoodie', 59.99, '2024-09-16 00:35:26.782', 'eae057e4-46df-4c08-bc74-26be357690eb', 'eaa4e5da-6c6f-4262-9343-152031e0f433', 4, 'white-hoodie');
INSERT INTO public.products VALUES ('69279cd7-2c32-4aa7-a1a7-80a0365990c0', 'TrendyWear', '2024-09-28 15:09:18.468', 'A stylish white t-shirt for women', true, 'White T-shirt', 29.99, '2024-09-28 15:09:18.468', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '7f97e8c8-72ef-4450-a98c-e53355f7c61e', 4.5, 'white-tshirt-women-20241212');
INSERT INTO public.products VALUES ('3bb694c1-86dd-4df8-b016-1da5f4de5ae7', 'Nike', '2024-09-28 15:12:06.625', 'A cozy purple hoodie for women', false, 'Purple Hoodie', 69.99, '2024-09-28 15:22:44.744', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '1b5bce66-604a-489f-a7d3-487ad1760302', 4.6, 'purple-hoodie-32d0f257');
INSERT INTO public.products VALUES ('abb44828-c2d2-4b93-8e99-de11de710ba4', 'SummerVibes', '2024-09-28 15:12:24.542', 'A beautiful leaves pattern white dress for women', false, 'Leaves Pattern White Dress', 79.99, '2024-09-28 15:24:37.969', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '5b5419cf-d83b-4084-b29b-fadf8f7b2de7', 4.7, 'leaves-pattern-white-dress-05f82fae');
INSERT INTO public.products VALUES ('9f38cf13-9827-446f-8293-c01bc8ca3cdf', 'TrendyWear', '2024-09-28 15:12:34.462', 'A trendy white graphic crop top for women', true, 'White Graphic Crop Top', 39.99, '2024-09-28 15:25:48.154', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '2a24f378-2b25-4700-a644-d3f850d7411c', 4.3, 'white-graphic-crop-top-e142c61a');
INSERT INTO public.products VALUES ('5670f360-f80f-443c-bfcc-5d95522fa155', 'Nike', '2024-09-28 15:12:50.914', 'Stylish black shorts for women', false, 'Black Shorts', 34.99, '2024-09-28 15:26:46.082', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '658627fb-9889-4c46-9a68-8eadee4aa67e', 4.5, 'black-shorts-299a4c6f');
INSERT INTO public.products VALUES ('5e433553-38bd-40e0-aee6-3a6ca3d7f7e0', 'Nike', '2024-10-29 18:19:55.818', 'black tshirt', false, 'Black Tshirt 2024', 49.99, '2024-10-29 18:19:55.818', 'eae057e4-46df-4c08-bc74-26be357690eb', '9f8f396a-81ad-4542-b4ea-11434cd5345e', NULL, 'black-tshirt-2024');
INSERT INTO public.products VALUES ('d6404efc-ca9c-47b8-9b8c-8f6779409788', 'Nike', '2024-09-28 15:16:56.542', 'Classic black plain t-shirt for women', false, 'Black Plain T-shirt', 24.99, '2024-09-28 15:30:28.149', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '7f97e8c8-72ef-4450-a98c-e53355f7c61e', 4.5, 'black-plain-t-shirt-500f519f');
INSERT INTO public.products VALUES ('c64f23b7-ca78-4fab-8097-3a58221dbdaf', 'ChicStyle', '2024-09-28 15:16:14.943', 'Trendy women''s skinny jeans for a stylish look', true, 'Women''s Skinny Jeans', 59.99, '2024-09-28 15:32:12.817', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '200557d7-9d51-4a2b-b2fb-b664913108c5', 4.8, 'womens-skinny-jeans-d821c40a');
INSERT INTO public.products VALUES ('b287c075-fc07-4828-8d31-976ba899c5b7', 'TrendyWear', '2024-09-28 15:16:31.265', 'Comfortable crewneck sweatshirt for women', true, 'Crewneck Sweatshirt', 44.99, '2024-09-28 15:33:57.801', '9a2bb8e0-d8dc-4332-b914-ceb4095b3640', '1b5bce66-604a-489f-a7d3-487ad1760302', 4.6, 'crewneck-sweatshirt-2f1c5dd3');
INSERT INTO public.products VALUES ('f132315a-852f-4518-8c54-d7db0994741c', 'Nike', '2024-12-22 12:41:07.602', 'test', true, 'test', 59.00, '2024-12-22 12:41:07.602', 'eae057e4-46df-4c08-bc74-26be357690eb', '37d62cce-0558-4879-8a9f-830b7b9c5841', NULL, 'testproduct-1');


--
-- TOC entry 3245 (class 2606 OID 57350)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 49158)
-- Name: auth_authority auth_authority_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_authority
    ADD CONSTRAINT auth_authority_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 49168)
-- Name: auth_user_details auth_user_details_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_user_details
    ADD CONSTRAINT auth_user_details_pkey PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 24582)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3227 (class 2606 OID 24589)
-- Name: category_type category_type_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.category_type
    ADD CONSTRAINT category_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 57355)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 57363)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 57371)
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 32774)
-- Name: product_resources product_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.product_resources
    ADD CONSTRAINT product_resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 24596)
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 24603)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 49172)
-- Name: auth_user_details uk4f7wsuf56q7gw8qap4x6fbg25; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_user_details
    ADD CONSTRAINT uk4f7wsuf56q7gw8qap4x6fbg25 UNIQUE (phone_number);


--
-- TOC entry 3243 (class 2606 OID 49170)
-- Name: auth_user_details uki096w0jnvgjp70hpgqx5v1tbi; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_user_details
    ADD CONSTRAINT uki096w0jnvgjp70hpgqx5v1tbi UNIQUE (email);


--
-- TOC entry 3253 (class 2606 OID 57373)
-- Name: payment ukmf7n8wo2rwrxsd6f3t9ub2mep; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT ukmf7n8wo2rwrxsd6f3t9ub2mep UNIQUE (order_id);


--
-- TOC entry 3233 (class 2606 OID 40961)
-- Name: products ukostq1ec3toafnjok09y9l7dox; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT ukostq1ec3toafnjok09y9l7dox UNIQUE (slug);


--
-- TOC entry 3256 (class 2606 OID 24619)
-- Name: products fk2pw105qhy1aca2a6bqc19rbxn; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk2pw105qhy1aca2a6bqc19rbxn FOREIGN KEY (category_type_id) REFERENCES public.category_type(id);


--
-- TOC entry 3264 (class 2606 OID 57394)
-- Name: orders fk2r5d9dwditf15m06s7x6yusmf; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk2r5d9dwditf15m06s7x6yusmf FOREIGN KEY (user_id) REFERENCES public.auth_user_details(id);


--
-- TOC entry 3258 (class 2606 OID 32775)
-- Name: product_resources fk3k1pn3x472fqhckh85qc6m6y7; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.product_resources
    ADD CONSTRAINT fk3k1pn3x472fqhckh85qc6m6y7 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3262 (class 2606 OID 57379)
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3261 (class 2606 OID 57374)
-- Name: addresses fkbrvi7t6vo4g7pp8bij4dhlejv; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fkbrvi7t6vo4g7pp8bij4dhlejv FOREIGN KEY (user_id) REFERENCES public.auth_user_details(id);


--
-- TOC entry 3265 (class 2606 OID 57389)
-- Name: orders fkhlglkvf5i60dv6dn397ethgpt; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkhlglkvf5i60dv6dn397ethgpt FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- TOC entry 3266 (class 2606 OID 57399)
-- Name: payment fklouu98csyullos9k25tbpk4va; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fklouu98csyullos9k25tbpk4va FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3254 (class 2606 OID 24604)
-- Name: category_type fkmgwrsyriidy42m9273cybb8tr; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.category_type
    ADD CONSTRAINT fkmgwrsyriidy42m9273cybb8tr FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3259 (class 2606 OID 49173)
-- Name: auth_user_authority fkn7t2r8oft6j1w61po11wnb19w; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_user_authority
    ADD CONSTRAINT fkn7t2r8oft6j1w61po11wnb19w FOREIGN KEY (authorities_id) REFERENCES public.auth_authority(id);


--
-- TOC entry 3260 (class 2606 OID 49178)
-- Name: auth_user_authority fko4vmid5kx45903pdsst9qu1p0; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_user_authority
    ADD CONSTRAINT fko4vmid5kx45903pdsst9qu1p0 FOREIGN KEY (user_id) REFERENCES public.auth_user_details(id);


--
-- TOC entry 3263 (class 2606 OID 57384)
-- Name: order_items fkocimc7dtr037rh4ls4l95nlfi; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkocimc7dtr037rh4ls4l95nlfi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3257 (class 2606 OID 24614)
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3255 (class 2606 OID 24609)
-- Name: product_variant fktk6wrh1xwqq4vn2pf11mwycgv; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT fktk6wrh1xwqq4vn2pf11mwycgv FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 2082 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2081 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2025-04-21 11:38:34 IST

--
-- PostgreSQL database dump complete
--

