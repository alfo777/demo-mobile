import React, {useEffect, useState} from 'react';
import {songToTrack} from "../others/utils";
import {ScrollView, View} from "react-native";
import {containerStyle} from "../styles/genericStyles";
import PlayableListItem from "../Components/PlayableListItem";
import defaultArtwork from "../../assets/album-placeholder.png";
import usePlayerAction from "../Hooks/usePlayerAction";
import {getArtists} from "../Services/UsersService";
import {getAllAlbums} from "../Services/MediaService";

const toPlayable = album => {
  return {
    title: album.title,
    artwork: album.link ? {uri: album.link} : defaultArtwork,
    artist: album.artistNames ?? 'Unknown artists',
  };
};

const enrichWithArtistNames = (albums, artists) => albums.map(album => enrichWithArtistName(album, artists));

const enrichWithArtistName = (album, artists) => ({
  ...album,
  artistNames: album.artists
    .map(artistId => artists.find(a => a.id === artistId))
    .map(getUserName)
    .join(', '),
});

const getUserName = user => `${user.name} ${user.surname}`

const AlbumListScreen = ({navigation}) => {
  const [albumList, setAlbumList] = useState([]);

  const player = usePlayerAction();

  useEffect(() => {
    const getAlbumsWithArtists = async () => {
      const allAlbums = getAllAlbums();
      const artists = await getArtists().then(r => r.list);
      return allAlbums.then(albums => enrichWithArtistNames(albums, artists));
    }
    getAlbumsWithArtists().then(albums => {
      setAlbumList(albums);
    });
  }, []);

  useEffect(()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Álbumes' });
  }, []);

  return (
    <View style={containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {
            albumList.map((album, id) => {
              return (
                <PlayableListItem id={id}
                                  key={id}
                                  playableItem={toPlayable(album)}
                                  play={() => player.playList(album.songs.map(songToTrack), 0)}
                                  moreInfoCallback={() => {
                                    navigation.navigate('AlbumScreen', {
                                      albumId: album.id
                                    });
                                  }}/>

              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default AlbumListScreen;
