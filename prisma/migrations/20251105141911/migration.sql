-- AlterTable
CREATE SEQUENCE watchlistgroup_sortorder_seq;
ALTER TABLE "WatchlistGroup" ALTER COLUMN "sortOrder" SET DEFAULT nextval('watchlistgroup_sortorder_seq');
ALTER SEQUENCE watchlistgroup_sortorder_seq OWNED BY "WatchlistGroup"."sortOrder";

-- AlterTable
CREATE SEQUENCE watchlistitem_sortorder_seq;
ALTER TABLE "WatchlistItem" ALTER COLUMN "sortOrder" SET DEFAULT nextval('watchlistitem_sortorder_seq');
ALTER SEQUENCE watchlistitem_sortorder_seq OWNED BY "WatchlistItem"."sortOrder";
