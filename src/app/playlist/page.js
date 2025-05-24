"use client";
import { useState, useEffect } from 'react'
import { Search, Play, Plus, Trash2, Music, Heart, MoreHorizontal } from 'lucide-react'

// Mock data for songs
const mockSongs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
    },
    {
        id: 2,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: "2:54",
        coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
    },
    {
        id: 3,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:23",
        coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop"
    },
    {
        id: 4,
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        duration: "2:58",
        coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
    },
    {
        id: 5,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        album: "F*CK LOVE 3: OVER YOU",
        duration: "2:21",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop"
    },
    {
        id: 6,
        title: "Heat Waves",
        artist: "Glass Animals",
        album: "Dreamland",
        duration: "3:58",
        coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop"
    },
    {
        id: 7,
        title: "As It Was",
        artist: "Harry Styles",
        album: "Harry's House",
        duration: "2:47",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
    },
    {
        id: 8,
        title: "Anti-Hero",
        artist: "Taylor Swift",
        album: "Midnights",
        duration: "3:20",
        coverUrl: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=100&h=100&fit=crop"
    },
    {
        id: 9,
        title: "Flowers",
        artist: "Miley Cyrus",
        album: "Endless Summer Vacation",
        duration: "3:20",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
    },
    {
        id: 10,
        title: "Unholy",
        artist: "Sam Smith ft. Kim Petras",
        album: "Gloria",
        duration: "2:36",
        coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
    }
]

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredSongs, setFilteredSongs] = useState(mockSongs)
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [currentView, setCurrentView] = useState('search') // 'search' or 'playlist'
    const [dropdownSongId, setDropdownSongId] = useState(null);


    useEffect(() => {
        const filtered = mockSongs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.album.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredSongs(filtered)
    }, [searchTerm])

    useEffect(() => {
        const stored = localStorage.getItem("playlists");
        if (stored) {
            setPlaylists(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);

    const createPlaylist = () => {
        if (newPlaylistName.trim()) {
            const newPlaylist = {
                id: Date.now(),
                name: newPlaylistName,
                songs: [],
                createdAt: new Date().toLocaleDateString()
            }
            setPlaylists([...playlists, newPlaylist])
            setNewPlaylistName('')
            setShowCreatePlaylist(false)
        }
    }

    const addToPlaylist = (song, playlistId) => {
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === playlistId) {
                const songExists = playlist.songs.find(s => s.id === song.id)
                if (!songExists) {
                    return { ...playlist, songs: [...playlist.songs, song] }
                }
            }
            return playlist
        }))
    }

    const removeFromPlaylist = (songId, playlistId) => {

        setPlaylists(playlists.map(playlist => {
            if (playlist.id === playlistId) {
                return { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) }
            }
            return playlist
        }))

        setSelectedPlaylist(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                songs: prev.songs.filter(song => song.id !== songId),
            };
        });
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists(playlists.filter(p => p.id !== playlistId))
        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
            setSelectedPlaylist(null)
            setCurrentView('search')
        }
    }

    const viewPlaylist = (playlist) => {
        setSelectedPlaylist(playlist)
        setCurrentView('playlist')
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-900 min-h-screen p-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-green-400 mb-4">🎵 MusicApp</h1>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setCurrentView('search')}
                                className={`w-full text-left p-2 rounded hover:bg-gray-800 transition-colors ${currentView === 'search' ? 'bg-gray-800 text-green-400' : ''
                                    }`}
                            >
                                <Search className="inline w-5 h-5 mr-3" />
                                Search
                            </button>
                        </nav>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold">Your Playlists</h2>
                            <button
                                onClick={() => setShowCreatePlaylist(true)}
                                className="p-1 hover:bg-gray-800 rounded"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {showCreatePlaylist && (
                            <div className="mb-3 p-3 bg-gray-800 rounded">
                                <input
                                    type="text"
                                    placeholder="Playlist name"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={createPlaylist}
                                        className="px-3 py-1 bg-green-500 text-black rounded text-sm font-medium hover:bg-green-400"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={() => { setShowCreatePlaylist(false); setNewPlaylistName('') }}
                                        className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            {playlists.map(playlist => (
                                <div key={playlist.id} className="flex items-center justify-between group">
                                    <button
                                        onClick={() => viewPlaylist(playlist)}
                                        className={`flex-1 text-left p-2 rounded hover:bg-gray-800 transition-colors ${selectedPlaylist?.id === playlist.id ? 'bg-gray-800 text-green-400' : ''
                                            }`}
                                    >
                                        <Music className="inline w-4 h-4 mr-2" />
                                        <span className="truncate">{playlist.name}</span>
                                        <div className="text-xs text-gray-400 ml-6">
                                            {playlist.songs.length} songs
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => deletePlaylist(playlist.id)}
                                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {currentView === 'search' ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold mb-4">Search Music</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for songs, artists, or albums..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full max-w-md pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-6">TITLE</div>
                                    <div className="col-span-3">ALBUM</div>
                                    <div className="col-span-1"><p className="text-xl">⏱</p></div>
                                    <div className="col-span-1"></div>
                                </div>

                                {/* Scrollable List */}
                                <div className="max-h-[650px] overflow-y-auto">
                                    {filteredSongs.map((song, index) => (
                                        <div
                                            key={song.id}
                                            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800 transition-colors group"
                                        >
                                            <div className="col-span-1 text-gray-400 group-hover:text-white">
                                                {index + 1}
                                            </div>
                                            <div className="col-span-6 flex items-center">
                                                <img
                                                    src={song.coverUrl}
                                                    alt={song.title}
                                                    className="w-10 h-10 rounded mr-3"
                                                />
                                                <div>
                                                    <div className="font-medium text-white">{song.title}</div>
                                                    <div className="text-sm text-gray-400">{song.artist}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 text-gray-400 flex items-center">
                                                {song.album}
                                            </div>
                                            <div className="col-span-1 text-gray-400 flex items-center">
                                                {song.duration}
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                <div className="relative">
                                                    <button
                                                        className="p-1 rounded"
                                                        onClick={() => setDropdownSongId(dropdownSongId === song.id ? null : song.id)}
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>

                                                    {dropdownSongId === song.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                                                            <div className="p-2 text-sm text-white">
                                                                <div className="font-semibold mb-2">Add to playlist</div>
                                                                {playlists.length === 0 ? (
                                                                    <div className="text-gray-400">No playlists found</div>
                                                                ) : (
                                                                    playlists.map((playlist) => (
                                                                        <button
                                                                            key={playlist.id}
                                                                            onClick={() => {
                                                                                addToPlaylist(song, playlist.id);
                                                                                setDropdownSongId(null);
                                                                            }}
                                                                            className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
                                                                        >
                                                                            {playlist.name}
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="mb-6">
                                <button
                                    onClick={() => setCurrentView('search')}
                                    className="text-gray-400 hover:text-white mb-4 text-sm"
                                >
                                    ← Back to Search
                                </button>
                                <div className="flex items-center gap-6">
                                    <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                        <Music className="w-20 h-20 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">PLAYLIST</p>
                                        <h1 className="text-5xl font-bold mb-4">{selectedPlaylist?.name}</h1>
                                        <p className="text-gray-400">
                                            {selectedPlaylist?.songs.length} songs • Created {selectedPlaylist?.createdAt}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-6">TITLE</div>
                                    <div className="col-span-3">ALBUM</div>
                                    <div className="col-span-1">⏱</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {selectedPlaylist?.songs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg mb-2">Your playlist is empty</p>
                                        <p>Go to search and add some songs!</p>
                                    </div>
                                ) : (
                                    selectedPlaylist?.songs.map((song, index) => (
                                        <div
                                            key={song.id}
                                            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800 transition-colors group"
                                        >
                                            <div className="col-span-1 text-gray-400 group-hover:text-white">
                                                {index + 1}
                                            </div>
                                            <div className="col-span-6 flex items-center">
                                                <img
                                                    src={song.coverUrl}
                                                    alt={song.title}
                                                    className="w-10 h-10 rounded mr-3"
                                                />
                                                <div>
                                                    <div className="font-medium text-white">{song.title}</div>
                                                    <div className="text-sm text-gray-400">{song.artist}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 text-gray-400 flex items-center">
                                                {song.album}
                                            </div>
                                            <div className="col-span-1 text-gray-400 flex items-center">
                                                {song.duration}
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                <button
                                                    onClick={() => removeFromPlaylist(song.id, selectedPlaylist.id)}
                                                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}