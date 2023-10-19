import postgres from 'postgres';
import { DATABASE_URL } from '../config.json';

type postgresEffectedRows = postgres.RowList<postgres.Row[]>;

const createPirate = async (
  name: string,
  username: string,
  imageURL: string,
  wantedPosterURL: string
): Promise<postgresEffectedRows | undefined> => {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const insertPirate = {
      pirate_name: name,
      username: username,
      bounty: 1000,
      image_url: imageURL,
      poster_url: wantedPosterURL
    };
    const data = await sql`insert into pirates ${sql(insertPirate)}
    returning *`;
    return data;
  } catch (error) {
    console.log(`Was not able to create pirate ${name} for ${username}`);
    console.log(error);
  }
  return undefined;
};

async function getPoster(
  name: string,
  isUsername: boolean
): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data = isUsername
      ? await sql`select poster_url from pirates where username=${name}`
      : await sql`select poster_url from pirates where pirate_name=${name}`;
    if (data.length === 1) {
      return data[0].poster_url;
    }
  } catch (e) {
    console.log(`Failed to fetch poster url for ${name}`);
    console.log(e);
  }
  return null;
}

async function getPirateName(name: string): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`select pirate_name from pirates where username=${name}`;
    return data[0].pirate_name;
  } catch (e) {
    console.log(`Failed to fetch pirate name for ${name}`);
    console.log(e);
  }
  return null;
}

async function getImageUrl(name: string): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`select image_url from pirates where username=${name}`;
    return data[0].image_url;
  } catch (e) {
    console.log(`Failed to fetch image for ${name}`);
    console.log(e);
  }
  return null;
}

async function getBounty(username: string) {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`select bounty from pirates where username=${username}`;
    return data[0].bounty;
  } catch (e) {
    console.log(`Failed to fetch bount for ${username}`);
    console.log(e);
  }
  return null;
}

async function updateBounty(
  name: string,
  increase: number
): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`update pirates set bounty = bounty + ${increase} where username=${name}
    
    returning *`;
    if (data.length === 1) {
      return data[0].bounty; // new bounty
    }
  } catch (e) {
    console.log(`Failed to update bounty for ${name}`);
    console.log(e);
  }
  return null;
}

async function updatePoster(
  name: string,
  newURL: string
): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`update pirates set poster_url = ${newURL} where username=${name}
    
    returning *`;
    if (data.length === 1) {
      return data[0].poster_url;
    }
  } catch (e) {
    console.log(`Failed to update poster for ${name}`);
    console.log(e);
  }
  return null;
}

async function updateOGImage(
  name: string,
  newURL: string
): Promise<string | null> {
  try {
    const sql = postgres(DATABASE_URL, { ssl: 'require' });
    const data =
      await sql`update pirates set image_url = ${newURL} where username=${name}
    
    returning *`;
    if (data.length === 1) {
      return data[0].image_url;
    }
  } catch (e) {
    console.log(`Failed to update image for ${name}`);
    console.log(e);
  }
  return null;
}

export {
  createPirate,
  getPoster,
  getPirateName,
  getImageUrl,
  getBounty,
  updateBounty,
  updatePoster,
  updateOGImage
};
