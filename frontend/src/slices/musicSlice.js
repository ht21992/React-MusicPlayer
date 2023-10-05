import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const MusicInitialState = {
  loading: false,
  musics: [],
  music: {},
  error: "",
};

export const fetchMusicsAsync = createAsyncThunk(
  "projects/fetchMusics",
  async (filter = "") => {
    const response = await axios.get(`/api/musics?${filter}`);
    return response.data;
  }
);

export const fetchSingleMusicAsync = createAsyncThunk(
  "projects/fetchSingleMusic",
  async (musicObj) => {
    const response = await axios.get(`/api/musics/${musicObj["id"]}`);
    return response.data;
  }
);

export const addMusicAsync =
  (title, genre, link, cover_img) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    const body = JSON.stringify({
      title: title,
      genre: genre,
      link: link,
      cover_img: cover_img,
    });

    try {
      const res = await axios.post("/api/musics/", body, config);
      dispatch(addMusic(res.data));
    } catch (err) {
      const errData = Object.entries(err.response.data)[0];
      toast.error(`${errData[0]}: ${errData[1]}`);
    }
  };

export const delMusicAsync = (id) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  try {
    const response = await axios.delete(`/api/musics/${id}`, config);

    dispatch(deleteMusic({ id: id }));
  } catch (err) {
    toast.error("Sth went wrong while deleting the music");
  }
};

const MusicSlice = createSlice({
  name: "musics",
  initialState: MusicInitialState,

  reducers: {
    addMusic: (state, action) => {
      state.musics.unshift(action.payload);
      const musicListArr = state.musics;
      state.musics = [...musicListArr];
      toast.success("New music added");
    },

    deleteMusic: (state, action) => {
      const musicListArr = state.musics;
      musicListArr.splice(
        musicListArr.findIndex(({ id }) => id == action.payload.id),
        1
      );
      toast.success("Music has been deleted");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchMusicsAsync.pending, (state, action) => {
      state.loading = true;
      state.music = {};
      state.musics = [];
    });

    builder.addCase(fetchMusicsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.musics = action.payload.results;
      state.music = action.payload.results[0];
      state.error = "";
    });
    builder.addCase(fetchMusicsAsync.rejected, (state, action) => {
      state.loading = false;
      state.musics = [];
      state.music = {};
      state.error = action.error.message;
    });

    builder.addCase(fetchSingleMusicAsync.pending, (state, action) => {
      state.loading = true;
      state.music = {};
      state.error = "";
    });
    builder.addCase(fetchSingleMusicAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.music = action.payload;
      state.error = "";
    });
    builder.addCase(fetchSingleMusicAsync.rejected, (state, action) => {
      state.loading = false;
      state.music = {};
      state.error = action.error.message;
    });
  },
});

export const { addMusic, deleteMusic } = MusicSlice.actions;
export default MusicSlice.reducer;
