export const mainPageHTML = `
    <form>
      <label for="beach-input">Choose a New Jersey beach:</label>
        <input id="beach-input" list="beach-list" placeholder="Choose a beach..." />
        <datalist id="beach-list">
          <option value="Allenhurst" />
          <option value="Asbury Park" />
          <option value="Atlantic City" />
          <option value="Avalon" />
          <option value="Avon-by-the-Sea" />
          <option value="Barnegat Light" />
          <option value="Bay Head" />
          <option value="Beach Haven" />
          <option value="Belmar" />
          <option value="Bradley Beach" />
          <option value="Brick" />
          <option value="Brigantine" />
          <option value="Cape May" />
          <option value="Cape May Point" />
          <option value="Corson's Inlet State Park (Strathmere)" />
          <option value="Deal" />
          <option value="Gunnison Beach" />
          <option value="Harvey Cedars" />
          <option value="Island Beach State Park (Berkeley Twp.)" />
          <option value="Keansburg" />
          <option value="Lavallette" />
          <option value="Loch Arbour" />
          <option value="Long Beach" />
          <option value="Long Branch" />
          <option value="Longport" />
          <option value="Manasquan" />
          <option value="Mantoloking" />
          <option value="Margate City" />
          <option value="Monmouth Beach" />
          <option value="North Wildwood" />
          <option value="Ocean City" />
          <option value="Ocean Grove (Neptune)" />
          <option value="Ortley Beach (Toms River)" />
          <option value="Point Pleasant Beach" />
          <option value="Sandy Hook (Highlands)" />
          <option value="Sea Bright" />
          <option value="Sea Girt" />
          <option value="Sea Isle City" />
          <option value="Seaside Heights" />
          <option value="Seaside Park" />
          <option value="Seven Presidents Oceanfront Park (Long Branch)" />
          <option value="Ship Bottom" />
          <option value="Spring Lake" />
          <option value="Stone Harbor" />
          <option value="Strathmere (Upper Twp.)" />
          <option value="Surf City" />
          <option value="Union Beach" />
          <option value="Ventnor City" />
          <option value="West Wildwood" />
          <option value="Wildwood" />
          <option value="Wildwood Crest" />
        </datalist>
        <button type="button" id="beach-choice-button">Choose Beach</button>
    </form>

    <div id="svg-container">
      <img src="/images/jersey_beaches_map.svg" height="300px" width="210px">
    </div>
`;